import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize';
import { tw } from '../lib/tw';
import * as React from 'react';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps & { isError?: boolean }
>(function Textarea({ isError, className, ...props }, forwardedRef) {
  return (
    <TextareaAutosize
      {...props}
      className={tw(
        [
          'form-textarea md:text-sm w-full text-zinc-900 disabled:text-zinc-500 resize-y rounded',
          isError ? 'border-red-400' : 'border-zinc-300',
        ],
        [className]
      )}
      ref={forwardedRef}
    />
  );
});
