import cx from 'classnames';
import * as React from 'react';

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'size'> {
  /**
   * variant of the button
   */
  variant?: 'primary' | 'outline';
  /**
   * Size of the button
   *
   * @deprecated
   */
  size?: 'small' | 'large';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * `<Button />` component wraps a `<button />` element and spread all the props.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant,
      fullWidth = false,
      leftIcon = variant === 'outline' ? <span>✔</span> : undefined,
      children,
      color,
      style = {},
      size,
      ...props
    },
    ref
  ) {
    return (
      <button
        {...props}
        className={cx(
          'inline-flex items-center gap-1 px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:text-white',
          variant === 'primary' &&
            'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent',
          variant === 'outline' &&
            'text-indigo-500 bg-white hover:bg-gray-200 border-indigo-500',
          fullWidth && 'w-full justify-center',
          props.className
        )}
        style={{
          ...(color ? { color } : {}),
          ...style,
        }}
        ref={ref}
      >
        {leftIcon}
        {children}
      </button>
    );
  }
);
