import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import { TextTooltip, ToggleButton } from '@showroomjs/ui';

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
      <RectangleGroupIcon width={20} height={20} />
    </ToggleButton>
  </TextTooltip>
);
