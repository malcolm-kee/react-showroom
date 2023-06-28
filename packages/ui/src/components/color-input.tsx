import { isDefined } from '@showroomjs/core';
import * as React from 'react';
import { HexColorPicker } from 'react-colorful';
import { tw } from '../lib/tw';
import { Popover } from './popover';

export interface ColorInputProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'type'> {
  /**
   * Value of the color, in hex format, starting with # character.
   *
   * @example #ff0000
   */
  value: string;
  onValue: (value: string) => void;
  placeholder?: string;
}

export const ColorInput = React.forwardRef<HTMLButtonElement, ColorInputProps>(
  function ColorInput(
    { onValue, value, placeholder = 'Select color', ...props },
    ref
  ) {
    const [_value, _setValue] = React.useState('');
    const usedValue = isDefined(onValue) ? value : _value;
    const setValue = isDefined(onValue) ? onValue : _setValue;

    const onChange = React.useCallback(
      (value: string) => {
        if (validHex(value)) {
          setValue(`#${escapeHex(value)}`);
        }
      },
      [setValue]
    );

    return (
      <Popover>
        <Popover.Trigger
          ref={ref}
          className={tw(
            [
              'form-input block w-36 md:text-sm text-left',
              'bg-white border border-zinc-300 rounded',
              !usedValue && 'text-zinc-300 font-medium',
            ],
            [props.className]
          )}
        >
          {usedValue ? usedValue : placeholder}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <HexColorPicker color={usedValue} onChange={onChange} />
          </Popover.Content>
        </Popover.Portal>
      </Popover>
    );
  }
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
