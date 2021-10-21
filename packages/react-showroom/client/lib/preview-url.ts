import { basename, isSpa } from './config';

export const getPreviewUrl = (
  codeHash: string,
  componentDisplayName: string | undefined
) =>
  `${basename}/_preview${isSpa ? '.html/#/' : '/'}${codeHash}${
    componentDisplayName ? `/${encodeURIComponent(componentDisplayName)}` : ''
  }${isSpa ? '' : '/'}`;
