import * as React from 'react';
import { usePropsEditorContext } from '../lib/use-props-editor';
import { PropsEditor } from './props-editor';
import { Div } from './base';

export const PropsEditorPanel = ({
  background = 'gray',
}: {
  background?: 'gray' | 'white';
}) => {
  const editor = usePropsEditorContext();

  return editor ? (
    <Div
      css={{
        shadow: 'inner',
        borderRadius: '$base',
        backgroundColor: background === 'gray' ? '$gray-200' : 'White',
        px: '$2',
      }}
    >
      <PropsEditor editor={editor} />
    </Div>
  ) : null;
};
