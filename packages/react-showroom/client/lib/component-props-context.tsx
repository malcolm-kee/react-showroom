import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';
import { ComponentDoc, PropItem } from 'react-docgen-typescript';

export const ComponentMetaContext = createNameContext<
  (ComponentDoc & { id: string }) | undefined
>('ComponentDoc', undefined);

export const useComponentMeta = () => React.useContext(ComponentMetaContext);

export const isType = (prop: PropItem, type: string) =>
  prop.type.name === type ||
  (prop.type.name === 'enum' && prop.type.raw === type);
