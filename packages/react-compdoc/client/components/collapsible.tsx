import * as Collapsible from '@radix-ui/react-collapsible';
import { keyframes, styled } from '../stitches.config';

export { Root } from '@radix-ui/react-collapsible';

export const Button = styled(Collapsible.Trigger, {
  color: '$gray-500',
  fontSize: '$sm',
  lineHeight: '$sm',
  position: 'relative',
  fontWeight: '600',
  px: '$1',
  '&:active': {
    top: '$px',
  },
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outlineColor: '$gray-200',
    outlineStyle: 'solid',
    outlineWidth: '2px',
  },
});

const open = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-collapsible-content-height)' },
});

const close = keyframes({
  from: { height: 'var(--radix-collapsible-content-height)' },
  to: { height: 0 },
});

export const Content = styled(Collapsible.Content, {
  overflow: 'hidden',
  '&[data-state="open"]': { animation: `${open} 300ms ease-out` },
  '&[data-state="closed"]': { animation: `${close} 300ms ease-out` },
});
