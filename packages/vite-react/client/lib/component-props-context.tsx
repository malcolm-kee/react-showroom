import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';
import { Props } from 'react-docgen-typescript';

export const ComponentPropsContext = createNameContext<Props>(
  'ComponentProps',
  {}
);

export const useComponentProps = () => React.useContext(ComponentPropsContext);
