import React from 'react';
import { styled } from '../stitches.config';

const StyledTable = styled('table', {
  minWidth: '100%',
});

const TableImpl = function Table({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <TableWrapper {...props}>
      <StyledTable>{children}</StyledTable>
    </TableWrapper>
  );
};

const TableWrapper = styled('div', {
  overflowX: 'auto',
});

const Tr = styled('tr', {
  '&:nth-child(2n)': {
    backgroundColor: '$gray-50',
  },
  '&:hover': {
    backgroundColor: '$gray-100',
  },
});

const Th = styled('th', {
  py: '$1',
  px: '$3',
  fontSize: '$sm',
  lineHeight: '$sm',
  backgroundColor: '$gray-200',
  textAlign: 'left',
});

const Td = styled('td', {
  py: '$1',
  px: '$3',
  fontSize: '$sm',
  lineHeight: '$sm',
  borderBottom: '1px solid white',
});

export const Table = Object.assign(TableImpl, {
  Th,
  Td,
  Tr,
});
