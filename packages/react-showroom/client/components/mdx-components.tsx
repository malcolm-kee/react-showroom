import { styled } from '@showroomjs/ui';
import { H1 } from './base';
import { Code, Pre } from './code-block';
import { Link } from 'react-router-dom';
import * as React from 'react';

const MarkdownLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'>
>(function MarkdownLink({ href, ...props }, ref) {
  if (href && href.startsWith('/')) {
    return <Link to={href} {...props} ref={ref} />;
  }
  return <a href={href} {...props} ref={ref} />;
});

const Li = styled('li', {
  marginY: '0.5em',
});

const Ul = styled('ul', {
  marginY: '1.25em',
  [`& ${Li}`]: {
    position: 'relative',
    paddingLeft: '1.75em',
    '&:before': {
      content: '',
      position: 'absolute',
      backgroundColor: '#d1d5db',
      borderRadius: '50%',
      width: '0.375em',
      height: '0.375em',
      top: 'calc(.875em - .1875em)',
      left: '0.25em',
    },
  },
});

export const mdxComponents = {
  h1: H1,
  h2: styled('h2', {
    fontSize: '$2xl',
    lineHeight: '$2xl',
    '@sm': {
      fontSize: '$3xl',
      lineHeight: '$3xl',
    },

    marginTop: '$12',
    marginBottom: '$2',
  }),
  h3: styled('h3', {
    fontSize: '$xl',
    lineHeight: '$xl',
    '@sm': {
      fontSize: '$2xl',
      lineHeight: '$2xl',
    },
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
  a: styled(MarkdownLink, {
    textDecoration: 'none',
    color: '$primary-700',
    '&:hover': {
      textDecoration: 'underline',
    },
  }),
  ul: Ul,
  li: Li,
  // head: Helmet as any, // somehow this not working
};
