import * as React from 'react';
import { useDebouncedCallback } from './use-debounced-callback';

/**
 * use `MutationObserver` to force rerender when subtree changes.
 */
export const useForceUpdateOnSubtreeChange = <Target extends HTMLElement>(
  target: React.RefObject<Target>,
  {
    init = defaultInit,
    cbDelay = 200,
  }: {
    init?: MutationObserverInit;
    cbDelay?: number;
  } = {}
) => {
  const [, forceUpdate] = React.useState<unknown>();

  const mutationCb = useDebouncedCallback<MutationCallback>(
    forceUpdate,
    cbDelay
  );
  const observerRef = React.useRef<MutationObserver>();

  React.useEffect(() => {
    const observer = new MutationObserver(mutationCb);
    observerRef.current = observer;

    return () => {
      observerRef.current = undefined;
    };
  }, []);

  React.useEffect(() => {
    const observer = observerRef.current;

    if (observer && target.current) {
      observer.observe(target.current, init);

      return () => observer.disconnect();
    }
  }, [init]);
};

const defaultInit: MutationObserverInit = {
  childList: true,
  attributes: true,
  subtree: true,
  characterData: true,
};
