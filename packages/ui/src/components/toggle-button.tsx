import { Root } from '@radix-ui/react-toggle';
import { styled } from '../stitches.config';

export const ToggleButton = styled(Root, {
  all: 'unset',
  backgroundColor: 'white',
  color: '$gray-400',
  height: 35,
  minWidth: 35,
  px: '$1',
  display: 'flex',
  fontSize: 15,
  lineHeight: 1,
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  borderBlock: '2px solid transparent',
  transitionProperty: 'color, border-bottom-color',
  transition: '100ms ease-in-out',
  '&:hover': { color: '$gray-600' },
  '&[data-state=on]': {
    color: '$primary-800',
    borderBottomColor: '$primary-800',
  },
  '&:focus-visible': { outlineRing: '$primary-400' },
});
