import * as React from 'react';

export interface OldButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {
  color: 'primary' | 'secondary';
}

/**
 * @deprecated use `<Button />` instead.
 *
 * @version 1.0.0
 * @see http://some-stackoverflow-question-that-i-copy-but-dont-understand.com
 */
export const OldButton = ({
  type = 'button',
  color,
  ...props
}: OldButtonProps) => {
  return <button {...props} type={type} />;
};
