import { ShareIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { CopyButton, css, styled, useNotification } from '@showroomjs/ui';
import * as React from 'react';

export const StandaloneCodeLiveEditorCopyButton = () => {
  const showMsg = useNotification();

  return (
    <CopyButton
      getTextToCopy={() => {
        if (window) {
          return window.location.href;
        }
        return '';
      }}
      className={btn()}
      onCopy={() => showMsg('URL copied')}
      label={
        <>
          <BtnText>Share</BtnText>
          <StyledShareIcon width={20} height={20} />
        </>
      }
      successLabel={
        <>
          <CopiedMessage>Share</CopiedMessage>
          <MiniCheckIcon width={20} height={20} />
        </>
      }
    />
  );
};

const StyledShareIcon = styled(ShareIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const MiniCheckIcon = styled(CheckCircleIcon, {
  width: 20,
  height: 20,
  color: '$green-400',
});

const CopiedMessage = styled('span', {
  color: '$green-800',
});

export const BtnText = styled('span', {
  srOnly: true,
  '@sm': {
    srOnly: false,
  },
});

const btn = css({
  minWidth: 36,
  height: 36,
  px: 6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  position: 'relative',
});
