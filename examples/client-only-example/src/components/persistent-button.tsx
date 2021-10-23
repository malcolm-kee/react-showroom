import cx from 'classnames';
import * as React from 'react';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * variant of the button
   */
  variant?: 'primary' | 'outline';
}

/**
 * `<PersistentButtonButton />` component is a non SSR-friendly component.
 */
export const PersistentButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function PersistentButton({ variant, type = 'button', ...props }, ref) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        variant === 'primary' &&
          'text-white bg-pink-600 hover:bg-pink-700 border-transparent',
        variant === 'outline' &&
          'text-pink-500 bg-white hover:bg-gray-200 border-pink-500'
      )}
      {...props}
      ref={ref}
    >
      {window.location.href}
    </button>
  );
});
