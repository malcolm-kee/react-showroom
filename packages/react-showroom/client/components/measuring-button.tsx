import { TemplateIcon } from '@heroicons/react/outline';
import { TextTooltip, ToggleButton } from '@showroomjs/ui';
import * as React from 'react';

export const MeasuringButton = (props: {
  isActive: boolean;
  onClick: () => void;
}) => (
  <TextTooltip label="Measure">
    <ToggleButton
      pressed={props.isActive}
      onPressedChange={props.onClick}
      css={{
        border: 0,
        ...(props.isActive
          ? {
              shadow: 'inner',
              borderRadius: '$sm',
              backgroundColor: '$gray-200',
              color: '$gray-700',
            }
          : {
              backgroundColor: 'inherit',
              color: '$gray-400',
            }),
      }}
      aria-label="Measure"
    >
      <TemplateIcon width={20} height={20} />
    </ToggleButton>
  </TextTooltip>
);
