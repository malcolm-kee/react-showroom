import * as React from 'react';

/**
 * `useDebounce` allows you to debounce the update of a variable/state value.
 *
 * @param value value that you wish to debounce, e.g. the input value of a search field
 * @param wait wait time before the debounced value is updated
 */
export const useDebounce = <T>(value: T, wait = 500) => {
  const [dValue, setDValue] = React.useState(value);

  React.useEffect(() => {
    const timerId = window.setTimeout(() => setDValue(value), wait);

    return () => window.clearTimeout(timerId);
  }, [value, wait]);

  return dValue;
};
