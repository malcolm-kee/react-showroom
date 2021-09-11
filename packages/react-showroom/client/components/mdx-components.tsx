import { styled } from '@showroomjs/ui';
import { H1 } from './base';
import { Code, Pre } from './code-block';

export const mdxComponents = {
  h1: H1,
  h2: styled('h2', {
    fontSize: '$3xl',
    lineHeight: '$3xl',
    marginTop: '$12',
    marginBottom: '$2',
  }),
  h3: styled('h3', {
    fontSize: '$2xl',
    lineHeight: '$2xl',
    marginTop: '$6',
    marginBottom: '$2',
  }),
  pre: Pre,
  code: Code,
  p: styled('p', {
    marginY: '$3',
  }),
  hr: styled('hr', {
    borderColor: '$gray-200',
    marginY: '$6',
  }),
  // head: Helmet as any, // somehow this not working
};
