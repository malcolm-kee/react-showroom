import { SupportedLanguage } from '@showroomjs/core';
import { useCallback, useEffect, useRef } from 'react';
import { useConstant } from '@showroomjs/ui';
import { useStableCallback } from './callback';

export type Message =
  | {
      type: 'code';
      code: string;
      lang: SupportedLanguage;
    }
  | {
      type: 'heightChange';
      height: number;
    }
  | {
      type: 'ready';
    };

export const usePreviewWindow = (onMessage: (data: Message) => void) => {
  useMessage(onMessage, (ev) => ev.source === parent);

  useEffect(() => {
    parent.postMessage(
      {
        type: 'ready',
      },
      window.origin
    );
  }, []);

  const sendParent = useCallback((data: Message) => {
    parent.postMessage(data, window.origin);
  }, []);

  return {
    sendParent,
  };
};

export const useParentWindow = (onMessage?: (data: Message) => void) => {
  const targetRef = useRef<HTMLIFrameElement>(null);
  const messageQueue = useConstant<Array<Message>>(() => []);
  const isReadyRef = useRef(false);

  useMessage(
    (msg) => {
      if (msg.type === 'ready') {
        isReadyRef.current = true;
        const targetWindow =
          targetRef.current && targetRef.current.contentWindow;

        messageQueue.forEach((msg) => {
          targetWindow!.postMessage(msg, window.origin);
        });
      } else if (onMessage) {
        onMessage(msg);
      }
    },
    (ev) => {
      if (targetRef.current) {
        return ev.source === targetRef.current.contentWindow;
      }
      return false;
    }
  );

  const sendMessage = useCallback((data: Message) => {
    if (!isReadyRef.current) {
      messageQueue.push(data);
      return;
    }

    const targetWindow = targetRef.current && targetRef.current.contentWindow;

    if (targetWindow) {
      targetWindow.postMessage(data, window.origin);
    }
  }, []);

  return {
    targetRef,
    sendMessage,
  };
};

const useMessage = (
  onMessage: undefined | ((data: Message) => void),
  additionalFilter: (data: MessageEvent) => boolean
) => {
  const onMessageCb = useStableCallback(onMessage);

  useEffect(() => {
    function onMsg(ev: MessageEvent) {
      if (
        ev.origin === window.origin &&
        ev.data &&
        (!additionalFilter || additionalFilter(ev))
      ) {
        onMessageCb(ev.data);
      }
    }

    window.addEventListener('message', onMsg);

    return () => window.removeEventListener('message', onMsg);
  }, []);
};
