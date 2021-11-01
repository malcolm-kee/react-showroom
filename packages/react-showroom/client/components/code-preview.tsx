import { omit, safeEval } from '@showroomjs/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as tslib from 'tslib';
import { useCodeImports } from '../lib/code-imports-context';
import { useCodeVariables } from '../lib/code-variables-context';
import { prerenderExample } from '../lib/config';
import { useConsole } from '../lib/use-preview-console';
export interface CodePreviewProps {
  /**
   * Code that should call `render` to show the UI.
   */
  code: string;
  /**
   * Local names for the import statements in the code.
   */
  importNames: Array<string>;
  imports?: Record<string, any>;
}

export const CodePreview = (props: CodePreviewProps) => {
  const codeVariables = useCodeVariables();
  const imports = useCodeImports();
  const previewConsole = useConsole();

  const evalCode = React.useCallback(
    (
      code: string,
      importNames: Array<string>,
      imports: Record<string, any>,
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
            console: previewConsole,
          },
          importNames
        )
      ),
    []
  );

  const [ui, setUi] = React.useState<null | React.ReactElement>(() => {
    if (!prerenderExample || !props.code) {
      return null;
    }

    let result: React.ReactElement | null = null;

    evalCode(
      props.code,
      props.importNames,
      props.imports || imports,
      (ui: React.ReactElement) => {
        result = ui;
      }
    );

    return result;
  });

  React.useEffect(() => {
    let isLatest = true;
    evalCode(
      props.code,
      props.importNames,
      props.imports || imports,
      (newUi) => {
        if (isLatest) {
          setUi(newUi);
        }
      }
    );
    return () => {
      isLatest = false;
    };
  }, [props.code]);

  return ui;
};
