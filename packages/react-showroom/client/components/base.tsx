import { Link } from '@showroomjs/bundles/routing';
import { css, styled } from '@showroomjs/ui';

export const Div = styled('div');

export const Span = styled('span');

export const A = styled('a');

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
});

export const NavLink = styled(Link, {
  display: 'inline-block',
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
