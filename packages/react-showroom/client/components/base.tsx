import { css, styled } from '@showroomjs/ui';
import React from 'react';
import { Link } from '../lib/routing';

export const headerHeight = 62;

export const Div = styled('div');

export const Span = styled('span');

export const A = styled('a');

const HashLink = styled('a', {
  opacity: 0,
  paddingLeft: '$2',
  transition: 'opacity 100ms ease',
  color: '$primary-500',
  '&::before': {
    content: '#',
  },
});

const Heading = styled('h2', {
  [`&:hover ${HashLink}`]: {
    opacity: 1,
  },
});

export const createHeadingWithAnchor =
  (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
  ({ children, id, ...props }: React.ComponentPropsWithoutRef<'h2'>) => {
    return (
      <Heading as={tag} {...props} id={id}>
        {children}
        {id && (
          <HashLink aria-hidden href={`#${id}`} title="Direct link to heading">
            &#8203;
          </HashLink>
        )}
      </Heading>
    );
  };

export const H1 = styled('h1', {
  fontSize: '$4xl',
  lineHeight: '$4xl',
  '@sm': {
    fontSize: '$6xl',
    lineHeight: '$6xl',
  },
  marginTop: '$0',
  marginBottom: '$6',
  fontWeight: 700,
  color: '$gray-500',
  scrollMarginTop: headerHeight,
});

export const NavLink = styled(Link, {
  display: 'inline-block',
  textDecoration: 'none',
  color: 'inherit',
});

export const text = css({
  variants: {
    variant: {
      xs: {
        fontSize: '$xs',
        lineHeight: '$xs',
      },
      sm: {
        fontSize: '$sm',
        lineHeight: '$sm',
      },
      base: {
        fontSize: '$base',
        lineHeight: '$base',
      },
      lg: {
        fontSize: '$lg',
        lineHeight: '$lg',
      },
      xl: {
        fontSize: '$xl',
        lineHeight: '$xl',
      },
      '2xl': {
        fontSize: '$2xl',
        lineHeight: '$2xl',
      },
      '3xl': {
        fontSize: '$3xl',
        lineHeight: '$3xl',
      },
      '4xl': {
        fontSize: '$4xl',
        lineHeight: '$4xl',
      },
      '5xl': {
        fontSize: '$5xl',
        lineHeight: '$5xl',
      },
      '6xl': {
        fontSize: '$6xl',
        lineHeight: '$6xl',
      },
      '7xl': {
        fontSize: '$7xl',
        lineHeight: '$7xl',
      },
      '8xl': {
        fontSize: '$8xl',
        lineHeight: '$8xl',
      },
    },
  },
});
