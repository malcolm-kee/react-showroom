import * as React from 'react';

const useRef = React.useRef;

export const useIsInViewport = <Target extends HTMLElement>(options: {
  target: React.RefObject<Target>;
  init?: IntersectionObserverInit;
  disconnectOnLeave?: boolean;
}) => {
  const [, forceUpdate] = React.useState<unknown>();

  const observer = useRef<IntersectionObserver>();

  const inViewportRef = useRef(false);
  const intersected = useRef(false);

  function startObserver(observerInstance: IntersectionObserver) {
    const targetRef = options.target.current;
    if (targetRef) {
      observerInstance.observe(targetRef);
    }
  }

  function stopObserver(observerInstance: IntersectionObserver) {
    const targetRef = options.target.current;
    if (targetRef) {
      observerInstance.unobserve(targetRef);
    }

    observerInstance.disconnect();
    observer.current = undefined;
  }

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    const entry = entries[0] || {};
    const { isIntersecting, intersectionRatio } = entry;

    const isInViewport =
      typeof isIntersecting !== 'undefined'
        ? isIntersecting
        : intersectionRatio > 0;

    // enter
    if (!intersected.current && isInViewport) {
      intersected.current = true;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
      return;
    }

    // leave
    if (intersected.current && !isInViewport) {
      intersected.current = false;
      if (options.disconnectOnLeave && observer.current) {
        // disconnect obsever on leave
        observer.current.disconnect();
      }
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
    }
  }

  function initIntersectionObserver() {
    if (!observer.current) {
      // $FlowFixMe
      observer.current = new IntersectionObserver(
        handleIntersection,
        options.init
      );
      return observer.current;
    }
    return observer.current;
  }

  React.useEffect(() => {
    const observerRef = initIntersectionObserver();

    startObserver(observerRef);

    return () => {
      stopObserver(observerRef);
    };
  }, [options.init, options.disconnectOnLeave]);

  return {
    inViewport: inViewportRef.current,
  };
};
