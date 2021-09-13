import { omit, safeEval } from '@showroomjs/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { imports } from 'react-showroom-imports';
import * as tslib from 'tslib';
import { useCodeVariables } from '../lib/code-variables-context';
export interface CodePreviewProps {
  /**
   * Code that should call `render` to show the UI.
   */
  code: string;
  /**
   * Local names for the import statements in the code.
   */
  importNames: Array<string>;
}

export const CodePreview = (props: CodePreviewProps) => {
  const codeVariables = useCodeVariables();

  const evalCode = React.useCallback(
    (
      code: string,
      importNames: Array<string>,
      render: (ui: React.ReactElement) => void
    ) =>
      safeEval(
        code,
        // omit variables that has already been imported to avoid conflict.
        omit(
          {
            ...codeVariables,
            React,
            ReactDOM,
            render,
            tslib,
            imports,
          },
          importNames
        )
      ),
    []
  );

  const [ui, setUi] = React.useState<null | React.ReactElement>(() => {
    if (!props.code) {
      return null;
    }

    let result: React.ReactElement | null = null;

    evalCode(props.code, props.importNames, (ui: React.ReactElement) => {
      result = ui;
    });

    return result;
  });

  React.useEffect(() => {
    evalCode(props.code, props.importNames, setUi);
  }, [props.code]);

  return ui;
};