import { CheckIcon } from '@heroicons/react/20/solid';
import { DropdownMenu, DropdownMenuContentProps, tw } from '@showroomjs/ui';

export interface RadioDropdownProps<Value extends string>
  extends DropdownMenuContentProps {
  value: Value;
  onChangeValue: (value: Value) => void;
  options: Array<{
    value: Value;
    label: string;
  }>;
  className?: string;
}

export const RadioDropdown = <Value extends string>({
  value,
  onChangeValue,
  options,
  ...props
}: RadioDropdownProps<Value>) => {
  return (
    <DropdownMenu.Content {...props}>
      <DropdownMenu.RadioGroup
        value={value}
        onValueChange={onChangeValue as any}
      >
        {options.map((option, i) => (
          <DropdownMenu.RadioItem
            value={option.value}
            className={tw(['!pl-8 md:!text-sm'])}
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
