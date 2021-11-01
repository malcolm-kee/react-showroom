import * as React from 'react';
import { createNameContext } from '@showroomjs/ui';

export const UseCustomStateContext = createNameContext(
  'CustomUseState',
  React.useState
);

export const useCustomUseState = () => React.useContext(UseCustomStateContext);
