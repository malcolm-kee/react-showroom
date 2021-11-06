import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { styled } from '../stitches.config';
import {
  slideDownAndFade,
  slideLeftAndFade,
  slideRightAndFade,
  slideUpAndFade,
} from './animations';

const StyledContent = styled(TooltipPrimitive.Content, {
  borderRadius: '$base',
  px: '$2',
  py: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  backgroundColor: 'white',
  shadow: 'lg',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: 'white',
});

export const Tooltip = Object.assign({}, TooltipPrimitive, {
  Content: StyledContent,
  Arrow: StyledArrow,
});
