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

export type CommonMessage =
  | LogMessage
  | {
      type: 'heightChange';
      height: number;
    }
  | {
      type: 'ready';
    };

export type Message =
  | CommonMessage
  | {
      type: 'code';
      code: string;
      lang: SupportedLanguage;
    }
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

const useChildFrame = (onMessage: (data: Message) => void) => {
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

export const usePreviewWindow = useChildFrame;

export const useInteractionWindow = useChildFrame;

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
