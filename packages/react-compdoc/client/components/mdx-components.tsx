import { styled } from '@compdoc/ui';
import { H1 } from './base';
import { Code, Pre } from './code-block';

export const mdxComponents = {
  h1: H1,
  h2: styled('h2', {
    fontSize: '$4xl',
    lineHeight: '$4xl',
    marginBottom: '$2',
  }),
  h3: styled('h3', {
    fontSize: '$2xl',
    lineHeight: '$2xl',
  }),
  pre: Pre,
  code: Code,
  p: styled('p', {
    marginY: '$3',
  }),
  // head: Helmet as any, // somehow this not working
};
