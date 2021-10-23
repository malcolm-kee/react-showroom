import { useId } from '@radix-ui/react-id';
import { isDefined, isFunction, isNumber, noop } from '@showroomjs/core';
import * as React from 'react';
import useConstant from 'use-constant';
import { useStableCallback } from './use-stable-callback';
import { createNameContext } from './create-named-context';

export type AddNotification = (
  msg: string,
  options?: { removeAfterMs?: number }
) => () => void;

const createNoop = () => noop;

const NotificationContext = createNameContext<AddNotification>(
  'NotificationContext',
  createNoop
);

export const NotificationProvider = NotificationContext.Provider;

/**
 * `useNotificationState` declare an array state that allows you to append item that auto removed after some time.
 *
 * @param init initial value
 */
export const useNotificationState = <T>(
  init: Array<T> | (() => Array<T>) = []
) => {
  const id = useId();
  const idCount = React.useRef(0);

  const getId = React.useCallback(() => `${id}-${idCount.current++}`, [id]);

  const [items, setItems] = React.useState<Array<{ value: T; key: string }>>(
    () => {
      const initValue = isFunction(init) ? init() : init;
      return initValue.map((value) => ({
        value,
        key: getId(),
      }));
    }
  );
  const timerMap = useConstant(() => new Map<string, number>());

  React.useEffect(
    () =>
      function cleanupTimers() {
        timerMap.forEach((t) => window.clearTimeout(t));
        timerMap.clear();
      },
    []
  );

  const removeItem = useStableCallback(function removeItem(item: {
    value: T;
    key: string;
  }) {
    setItems((prevItems) => prevItems.filter((i) => i !== item));
    const timer = timerMap.get(item.key);
    if (isDefined(timer)) {
      window.clearTimeout(timer);
      timerMap.delete(item.key);
    }
  });

  return {
    items: React.useMemo(
      () =>
        items.map((item) => ({
          ...item,
          update: (updatedItem: T) => {
            setItems((prevItems) =>
              prevItems.map((prevItem) =>
                prevItem === item
                  ? { ...prevItem, value: updatedItem }
                  : prevItem
              )
            );
          },
          remove: () => removeItem(item),
        })),
      [items]
    ),
    append: React.useCallback(
      function appendItem(
        item: T,
        { removeAfterMs }: { removeAfterMs?: number } = {}
      ) {
        const key = getId();
        const record = {
          value: item,
          key,
        };
        setItems((prevItems) => prevItems.concat(record));

        if (isNumber(removeAfterMs)) {
          const timer = window.setTimeout(() => {
            removeItem(record);
          }, removeAfterMs);

          timerMap.set(key, timer);
        }

        return () => {
          removeItem(record);
        };
      },
      [timerMap, removeItem]
    ),
    clear: useStableCallback(function clearItems() {
      timerMap.forEach((t) => window.clearTimeout(t));
      timerMap.clear();
      setItems([]);
    }),
  } as const;
};

export const useNotification = () => React.useContext(NotificationContext);
