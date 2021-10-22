import * as React from 'react';
import mitt from 'mitt';

type StateEvent = {
  change: {
    key: string;
    value: any;
  };
};

const emitter = mitt<StateEvent>();

export const usePersistedState = <T>(initialState: T, storageKey: string) => {
  const [value, setValue] = React.useState<T>(initialState);
  const latestValueRef = React.useRef(value);
  latestValueRef.current = value;

  React.useEffect(() => {
    const syncStorage = () => {
      const latestValue = window.localStorage.getItem(storageKey);
      if (
        latestValue &&
        latestValue !== JSON.stringify(latestValueRef.current)
      ) {
        const result = parseSafely(latestValue);
        if (result !== null) {
          setValue(result);
        }
      }
    };
    syncStorage();
    window.addEventListener('storage', syncStorage);

    const onChange = (data: StateEvent['change']) => {
      if (data.key === storageKey) {
        if (data.value !== latestValueRef.current) {
          setValue(data.value);
        }
      }
    };
    emitter.on('change', onChange);
    return () => {
      window.removeEventListener('storage', syncStorage);
      emitter.off('change', onChange);
    };
  }, [storageKey]);

  const set = React.useCallback(
    (newValue: T) => {
      setValue(newValue);
      window.localStorage.setItem(storageKey, JSON.stringify(newValue));
      emitter.emit('change', {
        key: storageKey,
        value: newValue,
      });
    },
    [storageKey]
  );

  return [value, set] as const;
};

const parseSafely = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};
