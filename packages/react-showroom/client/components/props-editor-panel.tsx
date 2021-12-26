import { styled } from '@showroomjs/ui';
import * as React from 'react';
import { usePropsEditorContext } from '../lib/use-props-editor';
import { PropsEditor } from './props-editor';

export const PropsEditorPanel = ({
  background = 'gray',
}: {
  background?: 'gray' | 'white';
}) => {
  const editor = usePropsEditorContext();

  return editor ? (
    <Panel
      css={{
        backgroundColor: background === 'gray' ? '$gray-200' : 'White',
      }}
    >
      <PropsEditor editor={editor} />
    </Panel>
  ) : null;
};

const Panel = styled('div', {
  shadow: 'inner',
  borderRadius: '$base',
  px: '$2',
  py: '$4',
});
