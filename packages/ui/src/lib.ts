import { keyframes } from './stitches.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Callback<Args extends any[]> {
  (...args: Args): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function callAll<Args extends any[]>(
  ...fns: Array<Callback<Args> | undefined | boolean | null>
): Callback<Args> {
  return function callAllFns() {
    // eslint-disable-next-line prefer-rest-params
    const arg = arguments;
    fns.forEach(
      // eslint-disable-next-line prefer-spread, @typescript-eslint/no-explicit-any
      (fn) => typeof fn === 'function' && fn.apply(null, arg as any as Args)
    );
  };
}

export const pulse = keyframes({
  '0%, 100%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.5,
  },
});
