import { ReactShowroomMarkdownContent } from '@showroomjs/core/react';
import * as React from 'react';
import { CodeImportsContextProvider } from '../lib/code-imports-context';
import { CodeblocksContext } from '../lib/codeblocks-context';

export const MarkdownDataProvider = (props: {
  data: ReactShowroomMarkdownContent;
  children: React.ReactNode;
}) => {
  return (
    <CodeImportsContextProvider value={props.data.imports}>
      <CodeblocksContext.Provider value={props.data.codeblocks}>
        {props.children}
      </CodeblocksContext.Provider>
    </CodeImportsContextProvider>
  );
};
