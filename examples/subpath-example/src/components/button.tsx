import * as React from 'react';

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'size'> {
  /**
   * variant of the button
   */
  variant?: 'primary' | 'outline';
  size?: 'small' | 'large';
  children: React.ReactNode;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

/**
 * `<Button />` component wraps a `<button />` element and spread all the props.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, fullWidth, leftIcon, ...props }, ref) {
    return (
      <button
        style={{
          display: 'inline-block',
          alignItems: 'center',
          padding: `1rem 2rem`,
          color:
            variant === 'primary'
              ? 'white'
              : variant === 'outline'
              ? 'rgb(99, 102, 241)'
              : 'inherit',
          backgroundColor: variant === 'primary' ? 'rgb(79,70,229)' : 'white',
          borderWidth: '1px',
          borderRadius: '0.5rem',
          borderColor:
            variant === 'primary'
              ? 'transparent'
              : variant === 'outline'
              ? 'rgb(99, 102, 241)'
              : 'rgb(229, 231, 235)',
          width: fullWidth ? '100%' : undefined,
          cursor: 'pointer',
        }}
        {...props}
        ref={ref}
      />
    );
  }
);
