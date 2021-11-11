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
  /**
   * controls the border radius.
   */
  rounded?: 'sm' | 'lg';
}

/**
 * `<Button />` component is a wrapper of `<button>` element.
 *
 * Unspecified props will be spreaded.
 */
export const ButtonWithComments = ({
  type = 'button',
  variant,
  fullWidth,
  rounded,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      style={{
        backgroundColor: variant === 'primary' ? 'red' : 'blue',
        color: '#efefef',
        padding: '8px 16px',
        width: fullWidth ? '100%' : undefined,
        borderRadius: rounded ? (rounded === 'lg' ? 16 : 4) : undefined,
      }}
      type={type}
    />
  );
};
