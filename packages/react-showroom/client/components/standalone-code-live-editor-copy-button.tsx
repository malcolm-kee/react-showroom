import { CheckCircleIcon, ShareIcon } from '@heroicons/react/20/solid';
import { CopyButton, TextTooltip, tw, useNotification } from '@showroomjs/ui';

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
        className={tw([
          'inline-flex justify-center items-center gap-1 relative min-w-[36px] h-9 px-1.5',
        ])}
        onCopy={() => showMsg('URL copied')}
        label={
          <ShareIcon
            width={20}
            height={20}
            className={tw(['text-zinc-400 w-5 h-5'])}
          />
        }
        successLabel={
          <>
            <CheckCircleIcon
              width={20}
              height={20}
              className={tw(['text-green-400 w-5 h-5'])}
            />
          </>
        }
      />
    </TextTooltip>
  );
};
