import { PlayIcon } from '@heroicons/react/solid';
import { PlayMenu } from '@showroomjs/interaction';
import { styled } from '@showroomjs/ui';
import * as React from 'react';
import { useA11yCheck } from '../lib/use-a11y-check';
import { useA11yResult } from '../lib/use-a11y-result';
import { Div } from './base';
import { CodePreviewFrame, CodePreviewFrameProps } from './code-preview-frame';

export const CodePreviewShowroomFrame = (props: CodePreviewFrameProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const { setResult } = useA11yResult();
  useA11yCheck(rootRef, setResult);

  return (
    <>
      <CodePreviewFrame {...props} ref={rootRef} />
      <Div
        css={{
          position: 'absolute',
          right: '$1',
          top: '$1',
        }}
      >
        <PlayMenu rootRef={rootRef}>
          <Icon aria-label="Play" width={20} height={20} />
        </PlayMenu>
      </Div>
    </>
  );
};

const Icon = styled(PlayIcon, {
  color: '$gray-400',
});
