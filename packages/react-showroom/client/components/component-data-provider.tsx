import {
  ComponentDocItem,
  ReactShowroomComponentContent,
} from '@showroomjs/core/react';
import * as React from 'react';
import { CodeImportsContextProvider } from '../lib/code-imports-context';
import { CodeVariablesContextProvider } from '../lib/code-variables-context';
import { CodeblocksContext } from '../lib/codeblocks-context';
import { ComponentPropsContext } from '../lib/component-props-context';

export const ComponentDataProvider = (props: {
  children: React.ReactNode;
  content: ReactShowroomComponentContent;
}) => {
  const {
    content: { imports, codeblocks, metadata },
  } = props;

  const codeVariables = React.useMemo(() => {
    if (metadata.displayName && metadata.Component) {
      return {
        [metadata.displayName]: metadata.Component,
      };
    }
    return {};
  }, [metadata]);

  return (
    <CodeImportsContextProvider value={imports}>
      <ComponentPropsContext.Provider value={metadata.props}>
        <CodeVariablesContextProvider value={codeVariables}>
          <CodeblocksContext.Provider value={codeblocks}>
            {props.children}
          </CodeblocksContext.Provider>
        </CodeVariablesContextProvider>
      </ComponentPropsContext.Provider>
    </CodeImportsContextProvider>
  );
};
