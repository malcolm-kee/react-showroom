import { noop } from '@showroomjs/core';
import { useIsInViewport, useForceUpdateOnSubtreeChange } from '@showroomjs/ui';
import * as React from 'react';
import { checkA11y } from '../lib/check-a11y';
import { useA11yResult } from '../lib/use-a11y-result';
import { CodePreviewFrame, CodePreviewFrameProps } from './code-preview-frame';

const observerInit: IntersectionObserverInit = {
  rootMargin: `20% 0px`,
};

export const CodePreviewShowroomFrame = (props: CodePreviewFrameProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const { inViewport } = useIsInViewport({
    target: rootRef,
    init: observerInit,
  });

  const { setResult } = useA11yResult();

  useForceUpdateOnSubtreeChange(rootRef);

  React.useEffect(() => {
    if (!inViewport) {
      return;
    }

    if (rootRef.current) {
      let isCurrent = true;
      checkA11y(rootRef.current)
        .then((result) => {
          if (isCurrent) {
            setResult(result);
          }
        })
        .catch(noop);
      return () => {
        isCurrent = false;
      };
    }
  });

  return <CodePreviewFrame {...props} ref={rootRef} />;
};
