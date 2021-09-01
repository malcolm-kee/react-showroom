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
    return (
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        {...props}
        ref={ref}
      />
    );
  }
);
