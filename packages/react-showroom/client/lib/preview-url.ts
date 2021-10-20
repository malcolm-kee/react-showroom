import { basename } from './config';

const isSpa = true; // TODO: change this to based on settings once we prerender the example.

export const getPreviewUrl = (
  codeHash: string | undefined,
  code: string,
  lang: string
) =>
  `${basename}/_preview.html${
    isSpa ? '/#/' : '/'
  }${codeHash}?code=${code}&lang=${lang}`;
