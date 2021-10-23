import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

const ExampleRootContext = createNameContext<string>('ExampleRoot', '/');

export const ExampleRootContextProvider = ExampleRootContext.Provider;

export const useExampleRoot = () => React.useContext(ExampleRootContext);
