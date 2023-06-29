import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';
import { codeBlockImportOverrides } from './code-block-import-overrides';

export type CodeImports = Record<string, any>;

const CodeImportsContext = createNameContext<CodeImports>(
  'CodeImportsContext',
  {}
);

export const CodeImportsContextProvider = (props: {
  value: CodeImports;
  children: React.ReactNode;
}) => (
  <CodeImportsContext.Provider
    value={React.useMemo(
      () => ({
        ...codeBlockImportOverrides,
        ...props.value,
      }),
      [props.value]
    )}
  >
    {props.children}
  </CodeImportsContext.Provider>
);

export const useCodeImports = () => React.useContext(CodeImportsContext);

const LoadDtsContext = createNameContext<
  () => Promise<{ default: Record<string, string> }>
>('LoadDtsContext', () => Promise.resolve({ default: {} }));

export const LoadDtsContextProvider = LoadDtsContext.Provider;

export const useLoadDts = () => React.useContext(LoadDtsContext);
