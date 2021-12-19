import { callAll, noop } from '@showroomjs/core';
import * as React from 'react';
import { copyText } from '../lib/copy';
import { useTransientState } from '../lib/use-transient-state';
import { styled } from '../stitches.config';
import { buttonBase } from './base';

export interface CopyButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {
  getTextToCopy: () => string;
  label?: React.ReactNode;
  successLabel?: React.ReactNode;
  className?: string;
  onCopy?: () => void;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  function CopyButton(
    {
      getTextToCopy,
      label = 'Copy',
      successLabel = 'Copied!',
      className,
      onCopy = noop,
      onClick,
      ...btnProps
    },
    forwardedRef
  ) {
    const [copied, setCopied] = useTransientState(false);

    return (
      <Button
        type="button"
        onClick={callAll(onClick, () =>
          copyText(getTextToCopy()).then(() => {
            setCopied(true);
            onCopy();
          })
        )}
        className={className}
        {...btnProps}
        ref={forwardedRef}
      >
        {copied ? successLabel : label}
      </Button>
    );
  }
);

const Button = styled('button', {
  ...buttonBase,
  fontSize: '$sm',
  lineHeight: '$sm',
});
