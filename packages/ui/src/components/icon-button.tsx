import * as React from 'react';
import { tw } from '../lib/tw';

export type IconButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  sizeClass?: string;
  colorClass?: string;
  flat?: boolean;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      sizeClass = tw(['w-9 h-9']),
      colorClass = tw(['text-zinc-400 bg-white hover:bg-zinc-100']),
      flat,
      ...props
    },
    forwardedRef
  ) {
    return (
      <button
        type="button"
        {...props}
        className={tw(
          [
            'inline-flex justify-center items-center rounded-full cursor-pointer disabled:cursor-default',
            !flat && 'shadow',
          ],
          [sizeClass, colorClass, props.className]
        )}
        ref={forwardedRef}
      />
    );
  }
);
