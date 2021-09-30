import * as React from 'react';
import { copyText } from '../lib/copy';
import { useTransientState } from '../lib/use-transient-state';
import { styled } from '../stitches.config';

export interface CopyButtonProps {
  textToCopy: string;
  label?: React.ReactNode;
  successLabel?: React.ReactNode;
  className?: string;
}

export const CopyButton = ({
  textToCopy,
  label = 'Copy',
  successLabel = 'Copied!',
  className,
}: CopyButtonProps) => {
  const [copied, setCopied] = useTransientState(false);

  return (
    <Button
      type="button"
      onClick={() => copyText(textToCopy).then(() => setCopied(true))}
      className={className}
    >
      {copied ? successLabel : label}
    </Button>
  );
};

const Button = styled('button', {
  fontSize: '$sm',
  lineHeight: '$sm',
});
