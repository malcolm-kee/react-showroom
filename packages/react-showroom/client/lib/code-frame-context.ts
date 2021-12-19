import { FrameDimension } from '@showroomjs/core';
import { createNameContext } from '@showroomjs/ui';
import React from 'react';

interface CodeFrameContextType {
  showDeviceFrame: boolean;
  frameDimensions: Array<FrameDimension>;
}

const CodeFrameContext = createNameContext<CodeFrameContextType>(
  'CodeFrameContext',
  {
    showDeviceFrame: true,
    frameDimensions: [],
  }
);

export const CodeFrameContextProvider = CodeFrameContext.Provider;

export const useCodeFrameContext = () => React.useContext(CodeFrameContext);
