import * as React from 'react';
import { tw } from '../lib/tw';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'outline';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, ...props }, forwardedRef) {
    const classes = React.useMemo(() => {
      return tw(
        [
          'inline-flex justify-center items-center py-1 min-w-[60px] border rounded cursor-pointer disabled:cursor-default',
          variant &&
            {
              primary: 'bg-primary-600 text-white border-transparent',
              outline: 'bg-white text-primary-600 border-primary-600',
            }[variant],
        ],
        [props.className]
      );
    }, [variant, props.className]);

    return (
      <button type="button" {...props} ref={forwardedRef} className={classes} />
    );
  }
);
