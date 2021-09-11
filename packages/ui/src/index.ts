import { createContext } from 'react';

export * from './components/alert';
export * as Collapsible from './components/collapsible';
export * from './components/dialog';
export * from './components/search-dialog';
export * from './components/text-input';
export * from './lib';
export * from './stitches.config';

export const createNameContext = <ContextType>(
  name: string,
  defaultValue: ContextType
) => {
  const context = createContext(defaultValue);
  context.displayName = name;
  return context;
};
