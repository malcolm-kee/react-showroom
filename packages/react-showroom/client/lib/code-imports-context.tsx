import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

const CodeImportsContext = createNameContext<Record<string, any>>(
  'CodeImportsContext',
  {}
);

export const CodeImportsContextProvider = CodeImportsContext.Provider;

export const useCodeImports = () => React.useContext(CodeImportsContext);

const DependenciesVersionsContext = createNameContext<Record<string, string>>(
  'DependenciesVersions',
  {}
);

export const DependenciesVersionsContextProvider =
  DependenciesVersionsContext.Provider;

export const useDependenciesVersions = () =>
  React.useContext(DependenciesVersionsContext);
