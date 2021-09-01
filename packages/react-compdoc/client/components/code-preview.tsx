import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { safeEval } from '../lib/safe-eval';
import * as tslib from 'tslib';

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
    });
  }, [props.code]);

  return <div ref={containerRef} />;
};
