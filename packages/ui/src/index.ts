import { createContext } from 'react';

export { Root as Portal } from '@radix-ui/react-portal';
export * from './components/alert';
export * as Collapsible from './components/collapsible';
export * from './components/dialog';
export { DropdownMenu } from './components/dropdown-menu';
export * from './components/icon-button';
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
