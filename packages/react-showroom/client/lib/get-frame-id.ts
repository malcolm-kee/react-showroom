import { FrameDimension } from '@showroomjs/core';

export const getFrameId = (frame: FrameDimension) =>
  `${frame.name}-${frame.width}x${frame.height}`;
