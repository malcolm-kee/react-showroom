import mitt from 'mitt';

const cMethods = ['log', 'error', 'warn', 'info'] as const;

export type ConsoleEvent = {
  invoke: {
    method: typeof cMethods[number];
    data: Array<any>;
  };
};

export const listenForConsole = (consoleInstance = console) => {
  const events = mitt<ConsoleEvent>();
  const oriMethodMap = new Map<
    typeof cMethods[number],
    (...data: any) => void
  >();

  cMethods.forEach((method) => {
    const oriMethod = consoleInstance[method];
    oriMethodMap.set(method, oriMethod);

    consoleInstance[method] = function (...data: any[]) {
      events.emit('invoke', {
        method,
        data,
      });

      oriMethod.apply(consoleInstance, data);
    };
  });

  return {
    events,
    cleanup() {
      oriMethodMap.forEach((oriMethod, key) => {
        consoleInstance[key] = oriMethod;
      });
      events.all.clear();
    },
  };
};
