import { noop } from '@showroomjs/core';
import * as React from 'react';
import { checkA11y } from '../lib/check-a11y';
import { useA11yResult } from '../lib/use-a11y-result';
import { CodePreviewFrame, CodePreviewFrameProps } from './code-preview-frame';

export const CodePreviewShowroomFrame = (props: CodePreviewFrameProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const { setResult } = useA11yResult();

  React.useEffect(() => {
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
