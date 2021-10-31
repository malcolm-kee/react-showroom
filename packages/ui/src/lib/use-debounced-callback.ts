import * as React from 'react';
import { useStableCallback } from './use-stable-callback';

export const useDebouncedCallback = <Callback extends (...args: any[]) => any>(
  cb: Callback,
  delay = 3000
) => {
  const latestCallback = useStableCallback(cb);
  const latestTimerId = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    return function cleanup() {
      if (latestTimerId.current) {
        clearTimeout(latestTimerId.current);
      }
    };
  }, []);

  return React.useCallback(function cb(...args: Parameters<Callback>) {
    if (latestTimerId.current) {
      clearTimeout(latestTimerId.current);
    }
    latestTimerId.current = setTimeout(() => {
      latestCallback(...args);
    }, delay);
  }, []);
};
