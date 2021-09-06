import { styled } from '../stitches.config';
import { Code, Pre } from './code-block';

export const mdxComponents = {
  pre: Pre,
  code: Code,
  p: styled('p', {
    marginY: '$3',
  }),
} as const;
