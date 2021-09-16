import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

const CodeImportsContext = createNameContext<Record<string, any>>(
  'CodeImportsContext',
  {}
);

export const CodeImportsContextProvider = CodeImportsContext.Provider;

export const useCodeImports = () => React.useContext(CodeImportsContext);
