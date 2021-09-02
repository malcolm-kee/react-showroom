import * as React from 'react';
import cx from 'classnames';

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'size'> {
  /**
   * variant of the button
   */
  variant?: 'primary' | 'outline';
  size?: 'small' | 'large';
  children: React.ReactNode;
}

/**
 * `<Button />` component wraps a `<button />` element and spread all the props.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, ...props }, ref) {
    return (
      <button
        className={cx(
          'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          variant === 'primary' &&
            'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent',
          variant === 'outline' &&
            'text-indigo-500 bg-white hover:bg-gray-200 border-indigo-500'
        )}
        {...props}
        ref={ref}
      />
    );
  }
);
