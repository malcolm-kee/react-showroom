import * as React from 'react';

export const useHeightChange = (
  el: HTMLElement | null,
  onChange: (height: number) => void
) => {
  const onChangeCb = React.useMemo(() => debounce(onChange), [onChange]);

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // each entry is an instance of ResizeObserverEntry
        onChangeCb(entry.contentRect.height);
      }
    });

    if (el) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [el]);
};

const debounce = <F extends (...args: any[]) => void>(
  func: F,
  waitFor = 300
) => {
  let timeout: number = 0;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    setTimeout(() => func(...args), waitFor);
  };

  return debounced;
};
