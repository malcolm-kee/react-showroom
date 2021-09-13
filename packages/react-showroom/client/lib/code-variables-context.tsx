import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

const CodeVariablesContext = createNameContext<Record<string, any>>(
  'CodeVariablesContext',
  {}
);

export const CodeVariablesContextProvider = CodeVariablesContext.Provider;

export const useCodeVariables = () => React.useContext(CodeVariablesContext);
