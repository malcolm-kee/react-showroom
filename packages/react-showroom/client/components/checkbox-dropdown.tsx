import { CheckIcon } from '@heroicons/react/outline';
import { DropdownMenu } from '@showroomjs/ui';
import * as React from 'react';

const CheckboxDropdownItem = (props: {
  children: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <DropdownMenu.CheckboxItem
    checked={props.checked}
    onCheckedChange={props.onCheckedChange}
    css={{
      paddingLeft: '$8',
      '@md': {
        fontSize: '$sm',
        lineHeight: '$sm',
      },
    }}
  >
    <DropdownMenu.ItemIndicator>
      <CheckIcon width={20} height={20} />
    </DropdownMenu.ItemIndicator>
    {props.children}
  </DropdownMenu.CheckboxItem>
);

export const CheckboxDropdown = Object.assign(DropdownMenu.Content, {
  Item: CheckboxDropdownItem,
});
