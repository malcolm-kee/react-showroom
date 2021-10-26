import cx from 'classnames';
import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { callAll } from '../../lib/call-all';

export interface TextareaProps
  extends Omit<React.ComponentPropsWithoutRef<'textarea'>, 'style'> {
  /**
   * callback when value change
   */
  onValue?: (value: string) => void;
}

/**
 * `<Textarea />` is a wrapper on `textarea` element.
 *
 * It accepts all props `input` element accepts, including `ref`.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ onValue, className, onChange, ...textareaProps }, ref) {
    return (
      <TextareaAutosize
        className={cx(
          'rounded-md border-gray-300',
          textareaProps.disabled && 'bg-gray-200',
          className
        )}
        onChange={callAll(
          onChange,
          onValue && ((ev) => onValue(ev.target.value))
        )}
        {...textareaProps}
        ref={ref}
      />
    );
  }
);
