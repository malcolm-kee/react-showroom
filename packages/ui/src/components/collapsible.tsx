import { ChevronDownIcon } from '@heroicons/react/20/solid';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as React from 'react';
import { tw } from '../lib/tw';

const CollapsibleButton = React.forwardRef<
  HTMLButtonElement,
  CollapsiblePrimitive.CollapsibleTriggerProps
>(function CollapsibleButton(props, forwardedRef) {
  return (
    <CollapsiblePrimitive.Trigger
      ref={forwardedRef}
      {...props}
      className={tw(
        [
          'text-zinc-500 relative font-semibold px-1 border-0 bg-transparent cursor-pointer disabled:cursor-default',
        ],
        [props.className]
      )}
    />
  );
});

interface CollapsibleContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  animate?: boolean;
}

const Content = ({ animate, className, ...props }: CollapsibleContentProps) => (
  <CollapsiblePrimitive.Content
    {...props}
    className={tw(
      [
        'overflow-hidden',
        animate &&
          'data-[state=open]:animate-collapsible-open data-[state=closed]:animate-collapsible-closed',
      ],
      [className]
    )}
  />
);

const ToggleIcon = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<'svg'> & {
    direction?: 'down' | 'up' | 'right' | 'left';
  }
>(function ToggleIcon({ direction, ...props }, forwardedRef) {
  return (
    <ChevronDownIcon
      ref={forwardedRef}
      width={16}
      height={16}
      {...props}
      className={tw(
        [
          'text-zinc-500 transition',
          direction
            ? {
                down: 'rotate-0',
                up: '-rotate-180',
                right: '-rotate-90',
                left: 'rotate-90',
              }[direction]
            : 'rotate-0 group-data-[state=open]/collapsible:-rotate-180',
        ],
        [props.className]
      )}
    />
  );
});

const Root = React.forwardRef<
  HTMLDivElement,
  CollapsiblePrimitive.CollapsibleProps
>(function CollapsibleRoot(props, forwardedRef) {
  return (
    <CollapsiblePrimitive.Root
      ref={forwardedRef}
      {...props}
      className={tw(['group/collapsible'], [props.className])}
    />
  );
});

export const Collapsible = Object.assign(Root, {
  Button: CollapsibleButton,
  Content,
  ToggleIcon,
  Trigger: CollapsiblePrimitive.Trigger,
});
