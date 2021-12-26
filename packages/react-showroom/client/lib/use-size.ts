import useResizeObserver from '@react-hook/resize-observer';
import * as React from 'react';

export const useSize = <Target extends HTMLElement>(
  target: React.RefObject<Target>
) => {
  const [size, setSize] = React.useState<
    undefined | { width: number; height: number }
  >(undefined);

  React.useEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);

  useResizeObserver(target.current, (entry) => {
    setSize(entry.target.getBoundingClientRect());
  });

  return size;
};
