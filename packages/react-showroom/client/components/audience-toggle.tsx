import { CheckIcon } from '@heroicons/react/20/solid';
import { DropdownMenu, Switch, tw, useId } from '@showroomjs/ui';
import {
  Audience,
  useTargetAudience,
  useTargetAudienceDispatch,
} from '../lib/use-target-audience';

export const AudienceToggle = () => {
  const targetAudience = useTargetAudience();
  const setTargetAudience = useTargetAudienceDispatch();
  const id = useId();

  return (
    <div className={tw(['inline-flex items-center gap-3 p-3'])}>
      <label
        htmlFor={id}
        className={tw(['block w-14 text-sm uppercase text-zinc-500'])}
      >
        {targetAudience === 'developer' ? 'Code' : 'Design'}
      </label>
      <Switch
        checked={targetAudience === 'developer'}
        onCheckedChange={(checked) =>
          setTargetAudience(checked ? 'developer' : 'designer')
        }
        id={id}
      >
        <Switch.Thumb />
      </Switch>
    </div>
  );
};

export const AudienceDropdownGroup = () => {
  const targetAudience = useTargetAudience();
  const setTargetAudience = useTargetAudienceDispatch();

  return (
    <>
      <DropdownMenu.Separator />
      <DropdownMenu.Label>View As</DropdownMenu.Label>
      <DropdownMenu.RadioGroup
        value={targetAudience}
        onValueChange={(val) => setTargetAudience(val as Audience)}
      >
        <DropdownMenu.RadioItem value="designer">
          Designer
          <DropdownMenu.ItemIndicator
            className={tw(['left-auto right-2'])}
            style={{
              left: 'auto',
              right: 8,
            }}
          >
            <CheckIcon
              width={20}
              height={20}
              className={tw(['text-primary-500'])}
            />
          </DropdownMenu.ItemIndicator>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="developer">
          Engineer
          <DropdownMenu.ItemIndicator
            style={{
              left: 'auto',
              right: 8,
            }}
          >
            <CheckIcon
              width={20}
              height={20}
              className={tw(['text-primary-500'])}
            />
          </DropdownMenu.ItemIndicator>
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </>
  );
};
