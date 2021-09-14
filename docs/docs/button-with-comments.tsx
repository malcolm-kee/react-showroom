import * as React from 'react';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * variant for the button
   */
  variant: 'primary' | 'secondary';
  /**
   * specify if the button should takes up all the available horizontal space.
   */
  fullWidth?: boolean;
}

/**
 * `<Button />` component is a wrapper of `<button>` element.
 *
 * Unspecified props will be spreaded.
 */
export const Button = ({
  type = 'button',
  variant,
  fullWidth,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      style={{
        backgroundColor: variant === 'primary' ? 'red' : 'blue',
        color: '#efefef',
        padding: '8px 16px',
      }}
      type={type}
    />
  );
};
