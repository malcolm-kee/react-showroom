import { useQueryParams, useStableCallback } from '@showroomjs/ui';
import * as React from 'react';

export const useStateWithParams = <T extends unknown>(
  initialState: T,
  paramKey: string,
  transformParam: (paramValue: string) => T
) => {
  const transformFn = useStableCallback(transformParam);

  const [value, setValue] = React.useState(initialState);

  const [queryParams, setQueryParams, isReady] = useQueryParams();

  React.useEffect(() => {
    if (isReady) {
      const val = queryParams[paramKey];
      if (val) {
        setValue(transformFn(val));
      }
    }
  }, [isReady]);

  const setFn = React.useCallback(
    (newValue: T, paramValue: string | undefined) => {
      setValue(newValue);
      setQueryParams({
        [paramKey]: paramValue,
      });
    },
    [paramKey, setQueryParams]
  );

  return [value, setFn] as const;
};
