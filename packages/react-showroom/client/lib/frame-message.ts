import { useCallback, useEffect, useRef } from 'react';
import { useStableCallback } from './callback';

export interface Message {
  type: string;
  [key: string]: any;
}

export const useChildFrame = (onMessage: (data: Message) => void) => {
  const onMessageCb = useStableCallback(onMessage);

  useEffect(() => {
    function onMsg(ev: MessageEvent) {
      onMessageCb(ev.data);
    }

    window.addEventListener('message', onMsg);

    return () => window.removeEventListener('message', onMsg);
  }, []);
};

export const useParentFrame = () => {
  const targetRef = useRef<HTMLIFrameElement>(null);

  const sendMessage = useCallback((data: Message) => {
    const targetWindow = targetRef.current && targetRef.current.contentWindow;

    if (targetWindow) {
      targetWindow.postMessage(data);
    }
  }, []);

  return {
    targetRef,
    sendMessage,
  };
};
