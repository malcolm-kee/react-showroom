import { createNameContext } from '@showroomjs/ui';
import { isPlainObject } from '@showroomjs/core';
import * as React from 'react';

export type LogLevel = 'info' | 'log' | 'error' | 'warn' | 'fatal';

export interface ConsoleMessage {
  level: LogLevel;
  data: any[];
  count: number;
}

export const ConsoleContext = createNameContext(
  'PreviewConsole',
  Object.assign({}, console, { fatal: console.error })
);

const ConsoleMessageContext = createNameContext<Array<ConsoleMessage>>(
  'ConsoleMessage',
  []
);

export const PreviewConsoleProvider = (props: {
  children: React.ReactNode;
}) => {
  const [msgs, setMsgs] = React.useState<Array<ConsoleMessage>>([]);

  const previewContext = React.useMemo(() => {
    const addMessage = (level: LogLevel, ...msgs: any[]) => {
      setMsgs((oldMsgs) => {
        const lastMessage = oldMsgs[oldMsgs.length - 1];

        if (
          lastMessage &&
          lastMessage.level === level &&
          deepEqual(lastMessage.data, msgs)
        ) {
          return oldMsgs.map((msg, index) =>
            index === oldMsgs.length - 1
              ? {
                  ...msg,
                  count: msg.count + 1,
                }
              : msg
          );
        }

        return oldMsgs.concat({
          level: level,
          data: msgs,
          count: 1,
        });
      });
    };

    return Object.assign({}, console, {
      log: addMessage.bind(null, 'log'),
      error: addMessage.bind(null, 'error'),
      fatal: addMessage.bind(null, 'fatal'),
      warn: addMessage.bind(null, 'warn'),
      info: addMessage.bind(null, 'info'),
    });
  }, []);

  return (
    <ConsoleContext.Provider value={previewContext}>
      <ConsoleMessageContext.Provider value={msgs}>
        {props.children}
      </ConsoleMessageContext.Provider>
    </ConsoleContext.Provider>
  );
};

export const useConsole = () => React.useContext(ConsoleContext);

export const useConsoleMessage = () => React.useContext(ConsoleMessageContext);

const oKeys = Object.keys;
// https://stackoverflow.com/a/32922084/1866804
const deepEqual = (x: any, y: any): boolean => {
  if (Array.isArray(x)) {
    return Array.isArray(y) && x.every((item, i) => deepEqual(item, y[i]));
  }

  const tx = typeof x;
  const ty = typeof y;

  return x && y && tx === 'object' && tx === ty && isPlainObject(x)
    ? oKeys(x).length === oKeys(y).length &&
        oKeys(x).every((key) => deepEqual((x as any)[key], y[key]))
    : x === y;
};
