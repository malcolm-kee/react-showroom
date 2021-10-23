import { Root as Portal } from '@radix-ui/react-portal';
import { isNumber } from '@showroomjs/core';
import * as React from 'react';
import {
  AddNotification,
  NotificationProvider as StateProvider,
  useNotificationState,
} from '../lib/use-notification';
import { styled } from '../stitches.config';

export const NotificationProvider = (props: { children: React.ReactNode }) => {
  const { items, append } = useNotificationState<{
    msg: string;
    autoDismiss?: boolean;
  }>([]);

  const appendNotification = React.useCallback<AddNotification>(
    (msg, { removeAfterMs = 1000 } = {}) =>
      append(
        {
          msg,
          autoDismiss: isNumber(removeAfterMs),
        },
        { removeAfterMs }
      ),
    [append]
  );

  return (
    <StateProvider value={appendNotification}>
      {props.children}
      {items.length > 0 && (
        <Portal>
          <MessageRoot>
            <MessageList>
              {items.map((it) => (
                <MessageItem key={it.key}>{it.value.msg}</MessageItem>
              ))}
            </MessageList>
          </MessageRoot>
        </Portal>
      )}
    </StateProvider>
  );
};

const MessageRoot = styled('div', {
  position: 'fixed',
  bottom: '$2',
  right: '50%',
  transform: 'translateX(50%)',

  '@sm': {
    top: '$2',
    right: '$2',
    bottom: 'auto',
    transform: 'translateX(0)',
  },
});

const MessageList = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
});

const MessageItem = styled('li', {
  color: '$gray-100',
  backgroundColor: '$gray-800',
  px: '$4',
  py: '$2',
  borderRadius: '$lg',
  shadow: 'lg',
});
