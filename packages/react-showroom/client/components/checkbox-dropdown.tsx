import { CheckIcon } from '@heroicons/react/20/solid';
import { DropdownMenu, tw } from '@showroomjs/ui';
import * as React from 'react';

const CheckboxDropdownItem = (props: {
  children: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <DropdownMenu.CheckboxItem
    checked={props.checked}
    onCheckedChange={props.onCheckedChange}
    style={{
      paddingLeft: '2rem',
    }}
    className={tw(['md:text-sm'])}
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
