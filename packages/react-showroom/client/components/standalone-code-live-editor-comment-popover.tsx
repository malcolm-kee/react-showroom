import { Button, Popover, Textarea, tw } from '@showroomjs/ui';
import * as React from 'react';

export interface StandaloneCodeLiveEditorCommentPopoverProps
  extends Pick<
    React.ComponentPropsWithoutRef<typeof Popover>,
    'open' | 'onOpenChange'
  > {
  onAdd: (comment: string) => void;
  children: React.ReactNode;
}

export const StandaloneCodeLiveEditorCommentPopover = React.forwardRef<
  HTMLTextAreaElement,
  StandaloneCodeLiveEditorCommentPopoverProps
>(function StandaloneCodeLiveEditorCommentPopover(props, forwardedRef) {
  const [comment, setComment] = React.useState('');

  return (
    <Popover open={props.open} onOpenChange={props.onOpenChange}>
      <Popover.Anchor asChild>{props.children}</Popover.Anchor>
      <Popover.Content
        sideOffset={5}
        className={tw(['pointer-events-auto'])}
        onClick={(ev) => ev.stopPropagation()}
      >
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            props.onAdd(comment);
          }}
        >
          <Textarea
            placeholder="Add a comment"
            value={comment}
            onChange={(ev) => setComment(ev.target.value)}
            required
            ref={forwardedRef}
          />
          <div className={tw(['flex justify-end gap-3 pt-2'])}>
            <Popover.RawClose asChild>
              <Button variant="outline">Cancel</Button>
            </Popover.RawClose>
            <Button
              variant="primary"
              type="submit"
              disabled={comment.length === 0}
            >
              Post
            </Button>
          </div>
        </form>
        <Popover.Arrow />
      </Popover.Content>
    </Popover>
  );
});
