import { encodeDisplayName } from '@showroomjs/core';
import { basename } from './config';

export const getPreviewUrl = (
  codeHash: string,
  componentDisplayName: string | undefined
) =>
  `${basename}/_preview/${codeHash}${
    componentDisplayName ? `/${encodeDisplayName(componentDisplayName)}` : ''
  }/`;
