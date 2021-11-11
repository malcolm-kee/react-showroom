import * as React from 'react';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant: 'primary' | 'secondary';
  fullWidth?: boolean;
  rounded?: 'sm' | 'lg';
}

export const Button = ({
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
