import * as React from 'react';
import { TextInput, TextInputProps } from './text-input';
import { styled } from '../stitches.config';

export const ColorInput = styled(
  React.forwardRef<HTMLInputElement, TextInputProps>(function ColorInput(
    { onValue, type, ...props },
    ref
  ) {
    return (
      <TextInput
        {...props}
        onValue={(value) => {
          if (validHex(value) && onValue) {
            onValue(`#${escapeHex(value)}`);
          }
        }}
        spellCheck={false}
        ref={ref}
      />
    );
  })
);

const matcher = /^#?([0-9A-F]{3,8})$/i;

const validHex = (value: string, alpha?: boolean): boolean => {
  const match = matcher.exec(value);
  const length = match ? match[1].length : 0;

  return (
    length === 3 || // '#rgb' format
    length === 6 || // '#rrggbb' format
    (!!alpha && length === 4) || // '#rgba' format
    (!!alpha && length === 8) // '#rrggbbaa' format
  );
};

const escapeHex = (value: string): string =>
  value.replace(/([^0-9A-F]+)/gi, '').substr(0, 6);
