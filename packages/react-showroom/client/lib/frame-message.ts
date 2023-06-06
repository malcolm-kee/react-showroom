import type { SupportedLanguage } from '@showroomjs/core';
import { useConstant } from '@showroomjs/ui';
import { useCallback, useEffect, useRef } from 'react';
import { useStableCallback } from './callback';
import type { ConsoleMessage } from './use-preview-console';
import type { PropsEditorState } from './use-props-editor';
import type { AxeResults } from 'axe-core';

interface LogMessage extends Omit<ConsoleMessage, 'count'> {
  type: 'log';
}

interface DomEventBase<Type extends string, Init extends object = {}> {
  eventType: Type;
  tag: string;
  index: number;
  tagTotal: number;
  init?: Init;
}

interface KeyboardEventInit {
  key: string;
  code: string;
  keyCode: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

export type DomEvent =
  | DomEventBase<'click'>
  | DomEventBase<
      'change',
      {
        target: {
          value?: string;
          checked?: boolean;
          files?: Array<File> | null;
        };
      }
    >
  | DomEventBase<'keyUp', KeyboardEventInit>
  | DomEventBase<'keyDown', KeyboardEventInit>;

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
    }
  | {
      type: 'syncPropsEditor';
      data: PropsEditorState;
    }
  | {
      type: 'toggleMeasure';
      active: boolean;
    }
  | {
      type: 'a11yCheckResult';
      result: Pick<AxeResults, 'incomplete' | 'passes' | 'violations'>;
    }
  | {
      type: 'highlightElements';
      selectors: Array<string>;
      color: string;
    };

type SendMessage = (data: Message) => void;

export const usePreviewWindow = (onMessage: (data: Message) => void) => {
  const messageQueue = useConstant<Array<Message>>(() => []);
  const isReadyRef = useRef(false);

  const postMessageToParent: SendMessage = useCallback((data) => {
    parent.postMessage(data, window.origin);
  }, []);

  useMessage(
    (msg) => {
      if (msg && msg.type === 'ready') {
        isReadyRef.current = true;
        messageQueue.forEach(postMessageToParent);
      } else {
        onMessage(msg);
      }
    },
    (ev) => ev.source === parent
  );

  useEffect(() => {
    let timer: number | undefined = undefined;

    const sendIfNotReady = () => {
      if (!isReadyRef.current) {
        postMessageToParent({
          type: 'ready',
        });

        // it is possible that the parent is not ready yet when we send
        // for the first time, so we need to keep trying until we get a
        // response
        timer = window.setTimeout(sendIfNotReady, 1000);
      }
    };

    sendIfNotReady();

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const sendParent: SendMessage = useCallback(function sendMsgToParent(data) {
    try {
      if (!isReadyRef.current) {
        messageQueue.push(data);
        return;
      }
      postMessageToParent(data);
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

  const sendToFrame: SendMessage = useCallback((data) => {
    const targetWindow = targetRef.current && targetRef.current.contentWindow;

    if (targetWindow) {
      targetWindow.postMessage(data, window.origin);
    }
  }, []);

  useMessage(
    (msg) => {
      if (msg.type === 'ready') {
        isReadyRef.current = true;

        sendToFrame({ type: 'ready' });

        messageQueue.forEach(sendToFrame);
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

    sendToFrame(data);
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
