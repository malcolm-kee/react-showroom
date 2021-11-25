import { omit, safeEval } from '@showroomjs/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as tslib from 'tslib';
import { useCodeImports } from '../lib/code-imports-context';
import { useCodeVariables } from '../lib/code-variables-context';
import { prerenderExample } from '../lib/config';
import { useCustomUseState } from '../lib/use-custom-state';
import { useConsole, noopConsole } from '../lib/use-preview-console';
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
  skipConsoleForInitialRender?: boolean;
}

export const CodePreview = (props: CodePreviewProps) => {
  const codeVariables = useCodeVariables();
  const imports = useCodeImports();
  const previewConsole = useConsole();
  const useCustomState = useCustomUseState();

  const evalCode = React.useCallback(
    (
      code: string,
      options: {
        importNames: Array<string>;
        imports: Record<string, any>;
        render: (ui: React.ReactElement) => void;
        skipConsole?: boolean;
      }
    ) =>
      safeEval(
        code,
        // omit variables that has already been imported to avoid conflict.
        omit(
          {
            ...codeVariables,
            showroomUseState: React.useState,
            React: Object.assign({}, React, { useState: useCustomState }),
            ReactDOM,
            render: options.render,
            tslib,
            imports: options.imports,
            console: options.skipConsole
              ? Object.assign({}, previewConsole, noopConsole)
              : previewConsole,
          },
          options.importNames
        )
      ),
    []
  );

  const [ui, setUi] = React.useState<null | React.ReactElement>(() => {
    if (!prerenderExample || !props.code) {
      return null;
    }

    let result: React.ReactElement | null = null;

    evalCode(props.code, {
      importNames: props.importNames,
      imports: props.imports || imports,
      render: (ui: React.ReactElement) => {
        result = ui;
      },
      skipConsole: props.skipConsoleForInitialRender,
    });

    return result;
  });

  React.useEffect(() => {
    let isLatest = true;
    evalCode(props.code, {
      importNames: props.importNames,
      imports: props.imports || imports,
      render: (newUi) => {
        if (isLatest) {
          setUi(newUi);
        }
      },
    });
    return () => {
      isLatest = false;
    };
  }, [props.code]);

  return ui;
};
