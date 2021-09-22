import { styled, Table } from '@showroomjs/ui';
import { H1, headerHeight } from './base';
import { Code, Pre } from './code-block';
import { GenericLink } from './generic-link';

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

const Ol = styled('ul', {
  marginY: '1.25em',
  counterReset: 'list-item',
  [`& ${Li}`]: {
    counterIncrement: 'list-item',
    position: 'relative',
    paddingLeft: '1.75em',
    '&:before': {
      content: 'counter(list-item) ". "',
      position: 'absolute',
      fontWeight: '400',
      left: '0',
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
    scrollMarginTop: headerHeight,
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
    scrollMarginTop: headerHeight,
  }),
  h4: styled('h4', {
    fontSize: '$lg',
    fontWeight: 'bold',
    lineHeight: '$lg',
    marginTop: '$4',
    marginBottom: '$2',
    scrollMarginTop: headerHeight,
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
  a: styled(GenericLink, {
    textDecoration: 'none',
    color: '$primary-700',
    '&:hover': {
      textDecoration: 'underline',
    },
  }),
  ul: Ul,
  li: Li,
  ol: Ol,
  table: Table,
  th: Table.Th,
  td: Table.Td,
  tr: Table.Tr,
};
