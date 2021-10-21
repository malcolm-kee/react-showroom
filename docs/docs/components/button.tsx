import * as React from 'react';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant: 'primary' | 'secondary';
  fullWidth?: boolean;
}

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
