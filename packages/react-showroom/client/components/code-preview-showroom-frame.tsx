import * as React from 'react';
import { useA11yCheck } from '../lib/use-a11y-check';
import { useA11yResult } from '../lib/use-a11y-result';
import { CodePreviewFrame, CodePreviewFrameProps } from './code-preview-frame';

export const CodePreviewShowroomFrame = (props: CodePreviewFrameProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const { setResult } = useA11yResult();
  useA11yCheck(rootRef, setResult);

  return <CodePreviewFrame {...props} ref={rootRef} />;
};
