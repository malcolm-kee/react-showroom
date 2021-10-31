import { styled, Switch, useId, DropdownMenu } from '@showroomjs/ui';
import * as React from 'react';
import { CheckIcon } from '@heroicons/react/solid';
import {
  useTargetAudience,
  useTargetAudienceDispatch,
  Audience,
} from '../lib/use-target-audience';
import { Div } from './base';

export const AudienceToggle = () => {
  const targetAudience = useTargetAudience();
  const setTargetAudience = useTargetAudienceDispatch();
  const id = useId();

  return (
    <Div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '$3',
        px: '$3',
        py: '$3',
      }}
    >
      <Label htmlFor={id}>
        {targetAudience === 'developer' ? 'Code' : 'Design'}
      </Label>
      <Switch
        checked={targetAudience === 'developer'}
        onCheckedChange={(checked) =>
          setTargetAudience(checked ? 'developer' : 'designer')
        }
        id={id}
      >
        <Switch.Thumb />
      </Switch>
    </Div>
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
            css={{
              left: 'auto',
              right: 8,
            }}
          >
            <Icon width={20} height={20} />
          </DropdownMenu.ItemIndicator>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="developer">
          Engineer
          <DropdownMenu.ItemIndicator
            css={{
              left: 'auto',
              right: 8,
            }}
          >
            <Icon width={20} height={20} />
          </DropdownMenu.ItemIndicator>
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </>
  );
};

const Label = styled('label', {
  width: 56,
  display: 'block',
  color: '$gray-500',
});

const Icon = styled(CheckIcon, {
  color: '$primary-500',
});
