import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';
import { ComponentDoc } from 'react-docgen-typescript';

export const ComponentMetaContext = createNameContext<ComponentDoc | undefined>(
  'ComponentDoc',
  undefined
);

export const useComponentMeta = () => React.useContext(ComponentMetaContext);
