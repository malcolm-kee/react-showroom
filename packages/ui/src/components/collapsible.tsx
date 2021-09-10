import * as Collapsible from '@radix-ui/react-collapsible';
import { keyframes, styled } from '../stitches.config';
import { ChevronDownIcon } from '@heroicons/react/outline';

export const Button = styled(Collapsible.Trigger, {
  color: '$gray-500',
  position: 'relative',
  fontWeight: '600',
  px: '$1',
  outlineRing: '',
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

export const Root = styled(Collapsible.Root);

export const ToggleIcon = styled(ChevronDownIcon, {
  color: '$gray-500',
  transition: 'transform 300ms ease-in-out',
  transform: 'rotate(0deg)',
  variants: {
    hide: {
      true: {
        transform: 'rotate(-180deg)',
      },
    },
  },
});
