import { noop } from '@showroomjs/core';
import { useForceUpdateOnSubtreeChange, useIsInViewport } from '@showroomjs/ui';
import * as React from 'react';
import { checkA11y } from './check-a11y';
import type { A11yResult } from './use-a11y-result';

export const useA11yCheck = <Target extends HTMLElement>(
  target: React.RefObject<Target>,
  onValue: (result: A11yResult) => void
) => {
  const { inViewport } = useIsInViewport({
    target,
    init: observerInit,
    disconnectOnEnter: true,
  });

  useForceUpdateOnSubtreeChange(target);

  React.useEffect(() => {
    if (!inViewport) {
      return;
    }

    if (target.current) {
      let isCurrent = true;
      checkA11y(target.current)
        .then((result) => {
          if (isCurrent) {
            onValue(result);
          }
        })
        .catch(noop);

      return () => {
        isCurrent = false;
      };
    }
  });
};

const observerInit: IntersectionObserverInit = {
  rootMargin: `20% 20%`,
};
