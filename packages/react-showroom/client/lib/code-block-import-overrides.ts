import { codeBlockOverrides } from '@showroomjs/core';
import { usePropsEditor } from './use-props-editor';
import { useUnionProps } from './use-union-props';

export const codeBlockImportOverrides = codeBlockOverrides.createOverrides({
  'react-showroom/client': {
    usePropsEditor,
    useUnionProps,
  },
});
