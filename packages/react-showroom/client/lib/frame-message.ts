import { SupportedLanguage } from '@showroomjs/core';
import { useCallback, useEffect, useRef } from 'react';
import { useConstant } from '@showroomjs/ui';
import { useStableCallback } from './callback';
import { ConsoleMessage } from './use-preview-console';

interface LogMessage extends Omit<ConsoleMessage, 'count'> {
  type: 'log';
}

interface DomEventBase<Type extends string> {
  eventType: Type;
  tag: string;
  index: number;
  tagTotal: number;
}

interface KeyboardEventBase<Type extends string> extends DomEventBase<Type> {
  key: string;
  code: string;
  keyCode: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

export type DomEvent =
  | DomEventBase<'click'>
  | (DomEventBase<'change'> & {
      value: string;
      checked: boolean;
    })
  | KeyboardEventBase<'keyUp'>
  | KeyboardEventBase<'keyDown'>;

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
    }
  | LogMessage
  | {
      type: 'stateChange';
      stateId: string;
      stateValue: any;
    }
  | {
      type: 'syncState';
      stateId: string;
      stateValue: any;
    }
  | {
      type: 'compileStatus';
      isCompiling: boolean;
    }
  | {
      type: 'scroll';
      scrollPercentageXY: [number | null, number | null];
    }
  | {
      type: 'domEvent';
      data: DomEvent;
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

  const sendParent = useCallback(function sendMsgToParent(data: Message) {
    try {
      parent.postMessage(data, window.origin);
    } catch (err) {
      if (data.type === 'log') {
        console.group('Fail to log data into panel');
        const level = data.level === 'fatal' ? 'error' : data.level;
        console[level](...(data.data || []));
        console.groupEnd();
        sendMsgToParent({
          type: 'log',
          level: 'fatal',
          data: [`Data could not be logged. Check DevTools console.`],
        });
      } else {
        console.error(err);
      }
    }
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
