import { parseQueryString, stringifyQueryString } from '@showroomjs/core';
import { createNameContext } from '@showroomjs/ui';
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const QueryParamContext = createNameContext<
  ReturnType<typeof useQueryParamsState> | undefined
>('QueryParamContext', undefined);

const useQueryParamsState = () => {
  const location = useLocation();
  const history = useHistory();

  const [paramValue, setParamValue] = React.useState<{
    [key: string]: string | undefined;
  }>({});

  React.useEffect(() => {
    setParamValue(parseQueryString(location.search) as any);
  }, []);

  const setQueryParams = React.useCallback(
    (newState: { [key: string]: string | undefined }) => {
      const newValue = {
        ...paramValue,
        ...newState,
      };

      setParamValue(newValue);
      history.push({
        search: stringifyQueryString(newValue),
      });
    },
    [paramValue]
  );

  return [paramValue, setQueryParams] as const;
};

export const QueryParamProvider = (props: { children: React.ReactNode }) => {
  const paramState = useQueryParamsState();

  return (
    <QueryParamContext.Provider value={paramState}>
      {props.children}
    </QueryParamContext.Provider>
  );
};

export const useQueryParams = () => {
  const value = React.useContext(QueryParamContext);

  if (!value) {
    throw new Error('useQueryParams can only be used in QueryParamProvider');
  }

  return value;
};
