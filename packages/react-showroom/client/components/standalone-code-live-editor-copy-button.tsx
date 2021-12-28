import { ShareIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import {
  CopyButton,
  css,
  styled,
  TextTooltip,
  useNotification,
} from '@showroomjs/ui';
import * as React from 'react';

export interface StandaloneCodeLiveEditorCopyButtonProps {
  getTextToCopy: () => string;
}

export const StandaloneCodeLiveEditorCopyButton = (
  props: StandaloneCodeLiveEditorCopyButtonProps
) => {
  const showMsg = useNotification();

  return (
    <TextTooltip label="Share View">
      <CopyButton
        {...props}
        className={btn()}
        onCopy={() => showMsg('URL copied')}
        label={<StyledShareIcon width={20} height={20} />}
        successLabel={
          <>
            <MiniCheckIcon width={20} height={20} />
          </>
        }
      />
    </TextTooltip>
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
