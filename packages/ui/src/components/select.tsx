import * as React from 'react';
import { callAll } from '../lib';
import { styled } from '../stitches.config';

export interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
  onValue?: (value: string) => void;
}

export const Select = styled(
  React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { onValue, ...props },
    ref
  ) {
    return (
      <select
        {...props}
        onChange={callAll(
          props.onChange,
          onValue && ((ev) => onValue(ev.target.value))
        )}
        ref={ref}
      />
    );
  }),
  {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right .5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    borderRadius: '$base',
    border: '1px solid $gray-300',
    width: '100%',
    minWidth: 'none',
    px: '$3',
    py: '$1',
    fontSize: '$lg',
    fontFamily: 'inherit',
    lineHeight: '$lg',
    color: 'Black',
    backgroundColor: 'White',
    appearance: 'none',
    '@md': {
      fontSize: '$base',
      lineHeight: '$base',
    },
    '&:focus': {
      outline: 'none',
      borderColor: '$primary-300',
    },
    '&::placeholder': {
      color: '$gray-400',
    },
  }
);
