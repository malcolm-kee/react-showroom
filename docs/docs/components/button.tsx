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
  style = {},
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      style={{
        ...style,
        display: 'inline-flex',
        gap: 8,
        alignItems: 'center',
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
