import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

const CodeImportsContext = createNameContext<Record<string, any>>(
  'CodeImportsContext',
  {}
);

export const CodeImportsContextProvider = CodeImportsContext.Provider;

export const useCodeImports = () => React.useContext(CodeImportsContext);

const LoadDtsContext = createNameContext<
  () => Promise<{ default: Record<string, string> }>
>('LoadDtsContext', () => Promise.resolve({ default: {} }));

export const LoadDtsContextProvider = LoadDtsContext.Provider;

export const useLoadDts = () => React.useContext(LoadDtsContext);
