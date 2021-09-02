import * as React from 'react';
import cx from 'classnames';

export interface TextInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  onValue?: (value: string) => void;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ onValue, className, ...inputProps }, ref) {
    return (
      <input
        type="text"
        className={cx(
          'rounded-md border-gray-300',
          inputProps.disabled && 'bg-gray-200',
          className
        )}
        {...inputProps}
        ref={ref}
      />
    );
  }
);
