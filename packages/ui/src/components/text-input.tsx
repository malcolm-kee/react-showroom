import * as React from 'react';
import { callAll } from '../lib';
import { tw } from '../lib/tw';

export interface TextInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  onValue?: (value: string) => void;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ onValue, ...props }, ref) {
    return (
      <input
        {...props}
        onChange={callAll(
          props.onChange,
          onValue && ((ev) => onValue(ev.target.value))
        )}
        className={tw(
          [
            'form-input w-full sm:text-sm text-zinc-900 disabled:text-zinc-500 border-zinc-300 rounded',
          ],
          [props.className]
        )}
        ref={ref}
      />
    );
  }
);
