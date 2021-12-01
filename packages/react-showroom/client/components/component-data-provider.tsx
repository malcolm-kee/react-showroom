import { ReactShowroomComponentContent } from '@showroomjs/core/react';
import * as React from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';
import {
  CodeImportsContextProvider,
  LoadDtsContextProvider,
} from '../lib/code-imports-context';
import { CodeVariablesContextProvider } from '../lib/code-variables-context';
import { CodeblocksContext } from '../lib/codeblocks-context';
import { ComponentMetaContext } from '../lib/component-props-context';

export const ComponentDataProvider = (props: {
  children: React.ReactNode;
  content: ReactShowroomComponentContent;
  metadata: ComponentDoc & { id: string };
}) => {
  const {
    content: { imports, codeblocks, Component, loadDts },
    metadata,
  } = props;

  const codeVariables = React.useMemo(() => {
    if (metadata.displayName && Component) {
      return {
        [metadata.displayName]: Component,
      };
    }
    return {};
  }, [metadata, Component]);

  return (
    <CodeImportsContextProvider value={imports}>
      <LoadDtsContextProvider value={loadDts}>
        <ComponentMetaContext.Provider value={metadata}>
          <CodeVariablesContextProvider value={codeVariables}>
            <CodeblocksContext.Provider value={codeblocks}>
              {props.children}
            </CodeblocksContext.Provider>
          </CodeVariablesContextProvider>
        </ComponentMetaContext.Provider>
      </LoadDtsContextProvider>
    </CodeImportsContextProvider>
  );
};
