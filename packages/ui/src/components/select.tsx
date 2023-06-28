import * as React from 'react';
import { callAll } from '../lib';
import { tw } from '../lib/tw';

export interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
  onValue?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ onValue, ...props }, ref) {
    return (
      <select
        {...props}
        onChange={callAll(
          props.onChange,
          onValue && ((ev) => onValue(ev.target.value))
        )}
        className={tw(
          ['form-select w-full border-zinc-300 rounded md:text-sm'],
          [props.className]
        )}
        ref={ref}
      />
    );
  }
);
