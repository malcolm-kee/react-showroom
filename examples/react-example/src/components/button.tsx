import * as React from 'react';

export interface ButtonProps {
  variant: 'primary' | 'outline';
  children: React.ReactNode;
}

/**
 * `<Button />` component wraps a `<button />` element and spread all the props.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, ...props }, ref) {
    return <button {...props} ref={ref} />;
  }
);
