import * as React from 'react';
import { tw } from '../lib/tw';

export interface ShortcutKeyProps
  extends React.ComponentPropsWithoutRef<'span'> {
  render?: (p: {
    className?: string;
    children: React.ReactNode;
  }) => React.ReactElement | null;
}

export const ShortcutKey = React.forwardRef<HTMLSpanElement, ShortcutKeyProps>(
  function ShortcutKey({ render, className, ...props }, ref) {
    const cls = tw(
      ['text-sm px-1 py-0.5 text-zinc-400 border border-zinc-300 rounded-md'],
      [className]
    );

    if (render) {
      return render({
        className: cls,
        children: props.children,
      });
    }

    return <span {...props} className={cls} ref={ref} />;
  }
);
