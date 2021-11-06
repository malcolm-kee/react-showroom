import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { styled } from '../stitches.config';
import {
  slideDownAndFade,
  slideLeftAndFade,
  slideRightAndFade,
  slideUpAndFade,
} from './animations';
import { buttonBase } from './base';

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  minWidth: 220,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 5,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const itemStyles = {
  all: 'unset',
  fontSize: '$lg',
  lineHeight: '$lg',
  color: '$gray-700',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  px: '$4',
  py: '$1',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: '$gray-400',
    pointerEvents: 'none',
  },

  '&:focus': {
    backgroundColor: '$gray-200',
  },
};

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles });
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, {
  ...itemStyles,
});
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, {
  ...itemStyles,
});
const StyledTriggerItem = styled(DropdownMenuPrimitive.TriggerItem, {
  '&[data-state="open"]': {
    backgroundColor: '$primary-400',
    color: '$primary-900',
  },
  ...itemStyles,
});

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
  px: '$4',
  py: '$1',
  fontSize: '$base',
  lineHeight: '$base',
  color: '$gray-400',
});

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: '$gray-200',
  margin: 5,
});

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
  fill: 'white',
});

const Trigger = styled(DropdownMenuPrimitive.Trigger, {
  ...buttonBase,
});

// Exports
export const DropdownMenu = Object.assign(DropdownMenuPrimitive.Root, {
  Trigger,
  Content: StyledContent,
  Item: StyledItem,
  CheckboxItem: StyledCheckboxItem,
  RadioGroup: DropdownMenuPrimitive.RadioGroup,
  RadioItem: StyledRadioItem,
  ItemIndicator: StyledItemIndicator,
  TriggerItem: StyledTriggerItem,
  Label: StyledLabel,
  Separator: StyledSeparator,
  Arrow: StyledArrow,
});
