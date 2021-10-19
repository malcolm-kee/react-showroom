import { useCallback, useEffect, useRef } from 'react';

/**
 * Converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop and exposed as a stable function to avoid executing effects when
 * passed as a dependency.
 */
function createStableCallbackHook<T extends (...args: any[]) => any>(
  useEffectHook: (
    effect: React.EffectCallback,
    deps?: React.DependencyList | undefined
  ) => void,
  callback: T | null | undefined
): T {
  let callbackRef = useRef(callback);
  useEffectHook(() => {
    callbackRef.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    ((...args) => {
      callbackRef.current && callbackRef.current(...args);
    }) as T,
    []
  );
}

/**
 * Converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop and exposed as a stable function to avoid executing effects when passed
 * as a dependency.
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T | null | undefined
): T {
  return createStableCallbackHook(useEffect, callback);
}
