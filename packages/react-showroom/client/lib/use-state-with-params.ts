import { useQueryParams, useStableCallback } from '@showroomjs/ui';
import * as React from 'react';

export const useStateWithParams = <T extends unknown>(
  initialState: T,
  paramKey: string,
  transformParam: (paramValue: string) => T
) => {
  const transformFn = useStableCallback(transformParam);

  const [value, setValue] = React.useState(initialState);

  const [queryParams, setQueryParams] = useQueryParams();

  React.useEffect(() => {
    const val = queryParams.get(paramKey);
    if (val) {
      setValue(transformFn(val));
    }
  }, []);

  const setFn = React.useCallback(
    (newValue: T, paramValue: string | undefined) => {
      setValue(newValue);

      const nextParams: Record<string, string> = {};

      queryParams.forEach((value, key) => {
        if (key !== paramKey) {
          nextParams[key] = value;
        }
      });

      if (paramValue) {
        nextParams[paramKey] = paramValue;
      }

      setQueryParams(nextParams);
    },
    [paramKey, setQueryParams]
  );

  return [value, setFn] as const;
};
