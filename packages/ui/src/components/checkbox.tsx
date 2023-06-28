import { CheckIcon, MinusIcon } from '@heroicons/react/20/solid';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { tw } from '../lib/tw';

export type CheckboxProps = Omit<
  CheckboxPrimitive.CheckboxProps,
  'children' | 'asChild' | 'checked'
> & {
  checked: CheckboxPrimitive.CheckedState;
};

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(props, ref) {
    return (
      <CheckboxPrimitive.Root
        {...props}
        className={tw(
          [
            'flex justify-center items-center w-4 h-4',
            'rounded border focus:outline-primary-300 focus:outline-offset-2',
            props.checked === true
              ? 'bg-primary-600 border-primary-600'
              : 'bg-white border-gray-300',
          ],
          [props.className]
        )}
        ref={ref}
      >
        <CheckboxPrimitive.Indicator
          className={tw(['text-white leading-none'])}
        >
          {props.checked === 'indeterminate' && (
            <MinusIcon
              width={16}
              height={16}
              className={tw(['text-primary-500'])}
            />
          )}
          {props.checked === true && <CheckIcon width={16} height={16} />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
