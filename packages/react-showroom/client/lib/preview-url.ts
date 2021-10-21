import { basename } from './config';

const isSpa = true; // TODO: change this to based on settings once we prerender the example.

export const getPreviewUrl = (
  codeHash: string,
  componentDisplayName: string | undefined
) =>
  `${basename}/_preview.html${isSpa ? '/#/' : '/'}${codeHash}${
    componentDisplayName ? `/${encodeURIComponent(componentDisplayName)}` : ''
  }`;
