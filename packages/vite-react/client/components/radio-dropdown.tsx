import { CheckIcon } from '@heroicons/react/outline';
import { DropdownMenu } from '@showroomjs/ui';
import * as React from 'react';

export interface RadioDropdownProps<Value extends string> {
  value: Value;
  onChangeValue: (value: Value) => void;
  options: Array<{
    value: Value;
    label: string;
  }>;
}

export const RadioDropdown = <Value extends string>(
  props: RadioDropdownProps<Value>
) => {
  return (
    <DropdownMenu.Content>
      <DropdownMenu.RadioGroup
        value={props.value}
        onValueChange={props.onChangeValue as any}
      >
        {props.options.map((option, i) => (
          <DropdownMenu.RadioItem
            value={option.value}
            css={{
              paddingLeft: '$8',
              '@md': {
                fontSize: '$sm',
                lineHeight: '$sm',
              },
            }}
            key={i}
          >
            <DropdownMenu.ItemIndicator>
              <CheckIcon width={20} height={20} />
            </DropdownMenu.ItemIndicator>
            {option.label}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  );
};
