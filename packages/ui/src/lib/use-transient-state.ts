import * as React from 'react';

export const useTransientState = <T>(
  steadyState: T,
  restorationTime = 1000
) => {
  const [state, setState] = React.useState(steadyState);
  const [calledTimes, setCallTimes] = React.useState(0);

  const setTemporaryState = React.useCallback(function setTemporaryState(
    newValue: React.SetStateAction<T>
  ) {
    setState(newValue);
    setCallTimes((t) => t + 1);
  },
  []);

  React.useEffect(() => {
    if (state !== steadyState && restorationTime) {
      const timeoutId = setTimeout(
        () => setState(steadyState),
        restorationTime
      );

      return () => clearTimeout(timeoutId);
    }
  }, [state, steadyState, restorationTime, calledTimes]);

  return [state, setTemporaryState] as const;
};
