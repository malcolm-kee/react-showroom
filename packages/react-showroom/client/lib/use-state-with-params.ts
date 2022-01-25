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

      setQueryParams(
        {
          [paramKey]: paramValue || undefined,
        },
        {
          merge: true,
        }
      );
    },
    [paramKey, setQueryParams]
  );

  return [value, setFn] as const;
};
