import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as tslib from 'tslib';
import { safeEval } from '../lib/safe-eval';
import { imports } from 'react-compdoc-imports';

export interface CodePreview {
  /**
   * Code that should returns a JSX expression
   */
  code: string;
}

export const CodePreview = (props: CodePreview) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const render = React.useCallback((ui: React.ReactElement) => {
    if (containerRef.current) {
      ReactDOM.render(ui, containerRef.current);
    }
  }, []);

  React.useEffect(() => {
    safeEval(props.code, {
      React,
      ReactDOM,
      render,
      tslib,
      imports,
    });
  }, [props.code, render]);

  return <div ref={containerRef} />;
};
