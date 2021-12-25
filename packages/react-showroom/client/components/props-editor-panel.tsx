import * as React from 'react';
import { usePropsEditorContext } from '../lib/use-props-editor';
import { PropsEditor } from './props-editor';
import { Div } from './base';

export const PropsEditorPanel = () => {
  const editor = usePropsEditorContext();

  return editor ? (
    <Div
      css={{
        shadow: 'inner',
        borderRadius: '$base',
        backgroundColor: '$gray-200',
        px: '$2',
      }}
    >
      <PropsEditor editor={editor} />
    </Div>
  ) : null;
};
