import { callAll, noop } from '@showroomjs/core';
import * as React from 'react';
import { copyText } from '../lib/copy';
import { tw } from '../lib/tw';
import { useTransientState } from '../lib/use-transient-state';

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
      <button
        type="button"
        onClick={callAll(onClick, () =>
          copyText(getTextToCopy()).then(() => {
            setCopied(true);
            onCopy();
          })
        )}
        className={tw(['text-sm'], [className])}
        {...btnProps}
        ref={forwardedRef}
      >
        {copied ? successLabel : label}
      </button>
    );
  }
);
