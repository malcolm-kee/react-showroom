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
  data: Pick<ComponentDocItem, 'component'>;
  children: React.ReactNode;
  content: ReactShowroomComponentContent;
}) => {
  const {
    data: { component },
    content: { imports, codeblocks },
  } = props;

  const codeVariables = React.useMemo(() => {
    if (component.displayName && component.Component) {
      return {
        [component.displayName]: component.Component,
      };
    }
    return {};
  }, [component]);

  return (
    <CodeImportsContextProvider value={imports}>
      <ComponentPropsContext.Provider value={component.props}>
        <CodeVariablesContextProvider value={codeVariables}>
          <CodeblocksContext.Provider value={codeblocks}>
            {props.children}
          </CodeblocksContext.Provider>
        </CodeVariablesContextProvider>
      </ComponentPropsContext.Provider>
    </CodeImportsContextProvider>
  );
};
