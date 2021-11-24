import { basename } from './config';

export const getPreviewUrl = (
  codeHash: string,
  componentId: string | undefined
) => `${basename}/_preview/${codeHash}${componentId ? `/${componentId}` : ''}/`;
