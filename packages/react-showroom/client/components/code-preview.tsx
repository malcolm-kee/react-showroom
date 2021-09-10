import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as tslib from 'tslib';
import { safeEval } from '../lib/safe-eval';
import { imports } from 'react-showroom-imports';

export interface CodePreview {
  /**
   * Code that should call `render` to show the UI.
   */
  code: string;
}

export const CodePreview = (props: CodePreview) => {
  const [ui, setUi] = React.useState<null | React.ReactElement>(() => {
    if (!props.code) {
      return null;
    }

    let result: React.ReactElement | null = null;

    const render = (ui: React.ReactElement) => {
      result = ui;
    };

    safeEval(props.code, {
      React,
      ReactDOM,
      render,
      tslib,
      imports,
    });

    return result;
  });

  React.useEffect(() => {
    safeEval(props.code, {
      React,
      ReactDOM,
      render: setUi,
      tslib,
      imports,
    });
  }, [props.code]);

  return ui;
};
