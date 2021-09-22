import type { CodeBlocks } from '@showroomjs/core';
import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';

export const CodeblocksContext = createNameContext<CodeBlocks>(
  'ShowroomCodeblocksContext',
  {}
);

export const useCodeBlocks = () => React.useContext(CodeblocksContext);
