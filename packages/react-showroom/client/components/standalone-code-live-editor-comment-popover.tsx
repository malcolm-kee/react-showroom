import { Button, Popover, Textarea } from '@showroomjs/ui';
import * as React from 'react';
import { Div } from './base';

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
        css={{
          pointerEvents: 'auto',
        }}
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
          <Div
            css={{
              display: 'flex',
              justifyContent: 'end',
              gap: '$3',
              paddingTop: '$2',
            }}
          >
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
          </Div>
        </form>
        <Popover.Arrow />
      </Popover.Content>
    </Popover>
  );
});
