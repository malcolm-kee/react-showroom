import * as React from 'react';
import type { ComponentDocItem } from '@compdoc/core';

export const ComponentDataContext = React.createContext<
  ComponentDocItem | undefined
>(undefined);
ComponentDataContext.displayName = 'ComponentDataContext';
