import { XMarkIcon } from '@heroicons/react/20/solid';
import { tw } from '@showroomjs/ui';
import * as React from 'react';

const CommentListImpl = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(function CommentList(props, forwardedRef) {
  return (
    <ul
      {...props}
      ref={forwardedRef}
      className={tw(['grid gap-3 p-3'], [props.className])}
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', // not working with tailwind
        ...(props.style || {}),
      }}
    />
  );
});

interface CommentItemProps extends React.ComponentPropsWithoutRef<'li'> {
  onDismiss: () => void;
  active?: boolean;
}

function CommentItem({
  children,
  onDismiss,
  className,
  active,
  ...props
}: CommentItemProps) {
  return (
    <li
      {...props}
      className={tw(
        [
          'relative text-sm px-6 py-3 whitespace-pre-wrap cursor-pointer',
          active ? 'bg-yellow-200 shadow-lg' : 'bg-white',
        ],
        [className]
      )}
    >
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

export const CommentList = Object.assign(CommentListImpl, {
  Item: CommentItem,
});
