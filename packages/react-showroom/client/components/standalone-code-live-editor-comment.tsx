import { styled } from '@showroomjs/ui';
import * as React from 'react';
import { XIcon } from '@heroicons/react/outline';

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
      <DismissButton onClick={onDismiss} type="button">
        <DismissIcon width={20} height={20} />
      </DismissButton>
      {children}
    </li>
  );
}

const DismissIcon = styled(XIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const DismissButton = styled('button', {
  position: 'absolute',
  top: '$1',
  right: '$1',
});

const CommentItem = styled(CommentItemImpl, {
  px: '$6',
  py: '$3',
  cursor: 'pointer',
  backgroundColor: 'White',
  fontSize: '$sm',
  lineHeight: '$sm',
  position: 'relative',
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
