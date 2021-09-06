export interface Callback<Args extends any[]> {
  (...args: Args): void;
}

export function callAll<Args extends any[]>(
  ...fns: Array<Callback<Args> | undefined | boolean | null>
): Callback<Args> {
  return function callAllFns() {
    const arg = arguments;
    fns.forEach(
      (fn) => typeof fn === 'function' && fn.apply(null, arg as any as Args)
    );
  };
}
