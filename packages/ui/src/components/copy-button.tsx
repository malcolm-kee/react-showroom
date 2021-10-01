import * as React from 'react';
import { copyText } from '../lib/copy';
import { useTransientState } from '../lib/use-transient-state';
import { styled } from '../stitches.config';
import { buttonBase } from './base';

export interface CopyButtonProps {
  getTextToCopy: () => string;
  label?: React.ReactNode;
  successLabel?: React.ReactNode;
  className?: string;
}

export const CopyButton = ({
  getTextToCopy,
  label = 'Copy',
  successLabel = 'Copied!',
  className,
}: CopyButtonProps) => {
  const [copied, setCopied] = useTransientState(false);

  return (
    <Button
      type="button"
      onClick={() => copyText(getTextToCopy()).then(() => setCopied(true))}
      className={className}
    >
      {copied ? successLabel : label}
    </Button>
  );
};

const Button = styled('button', {
  ...buttonBase,
  fontSize: '$sm',
  lineHeight: '$sm',
});
