import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import { CodeImportsContextProvider } from '../lib/code-imports-context';
import { CodeblocksContext } from '../lib/codeblocks-context';

export const MarkdownDataProvider = (props: {
  data: ReactShowroomMarkdownSection;
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
