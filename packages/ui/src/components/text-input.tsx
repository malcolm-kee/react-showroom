import * as React from 'react';
import { callAll } from '../lib';
import { styled } from '../stitches.config';

export interface TextInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  onValue?: (value: string) => void;
}

export const TextInput = styled(
  React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { onValue, ...props },
    ref
  ) {
    return (
      <input
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
    borderRadius: '$base',
    border: '1px solid $gray-300',
    width: '100%',
    px: '$3',
    py: '$1',
    fontSize: '$lg',
    lineHeight: '$lg',
    color: 'Black',
    backgroundColor: 'White',
    '@md': {
      fontSize: '$base',
      lineHeight: '$base',
    },
    '&:focus': {
      outline: 'none',
      borderColor: '$primary-300',
    },
  }
);
