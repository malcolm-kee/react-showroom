import { createContext } from 'react';

export const createNameContext = <ContextType>(
  name: string,
  defaultValue: ContextType
) => {
  const context = createContext(defaultValue);
  context.displayName = name;
  return context;
};
