import { styled, tw } from '@showroomjs/ui';
import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

const CommentListImpl = styled('ul', {
  display: 'grid',
  gap: '$3',
  padding: '$3',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
});

interface CommentItemProps extends React.ComponentPropsWithoutRef<'li'> {
  onDismiss: () => void;
}

function CommentItemImpl({ children, onDismiss, ...props }: CommentItemProps) {
  return (
    <li {...props}>
      <button
        onClick={onDismiss}
        type="button"
        className={tw(['absolute top-1 right-1'])}
      >
        <XMarkIcon
          width={20}
          height={20}
          className={tw(['w-5 h-5 text-zinc-400'])}
        />
      </button>
      {children}
    </li>
  );
}

const CommentItem = styled(CommentItemImpl, {
  px: '$6',
  py: '$3',
  cursor: 'pointer',
  backgroundColor: 'White',
  fontSize: '$sm',
  lineHeight: '$sm',
  position: 'relative',
  whiteSpace: 'pre-wrap',
  variants: {
    active: {
      true: {
        backgroundColor: '$yellow-200',
        shadow: 'lg',
      },
    },
  },
});

export const CommentList = Object.assign(CommentListImpl, {
  Item: CommentItem,
});
