import * as SwitchPrimitive from '@radix-ui/react-switch';
import { styled } from '../stitches.config';

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 42,
  height: 25,
  backgroundColor: '$gray-400',
  borderRadius: '9999px',
  position: 'relative',
  boxShadow: `0 2px 10px $gray-500`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  cursor: 'pointer',
  '&:focus-visible': { outlineRing: '$primary-400' },
  '&[data-state="checked"]': { backgroundColor: '$primary-700' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 21,
  height: 21,
  backgroundColor: 'white',
  borderRadius: '9999px',
  boxShadow: `0 2px 2px $gray-500`,
  transition: 'transform 100ms',
  transform: 'translateX(2px)',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(19px)' },
});

export const Switch = Object.assign(StyledSwitch, {
  Thumb: StyledThumb,
});
