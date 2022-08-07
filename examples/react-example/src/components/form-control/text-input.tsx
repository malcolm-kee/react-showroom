import cx from 'classnames';
import * as React from 'react';
import { callAll } from '../../lib/call-all';
import { baseStyle } from './text-input.css';

export interface TextInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  /**
   * callback when value change
   */
  onValue?: (value: string) => void;
}

/**
 * `<TextInput />` is a wrapper on `input` element.
 *
 * It accepts all props `input` element accepts, including `ref`.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ onValue, className, onChange, ...inputProps }, ref) {
    return (
      <input
        type="text"
        className={cx(
          baseStyle,
          inputProps.disabled && 'bg-gray-200',
          className
        )}
        onChange={callAll(
          onChange,
          onValue && ((ev) => onValue(ev.target.value))
        )}
        {...inputProps}
        ref={ref}
      />
    );
  }
);
