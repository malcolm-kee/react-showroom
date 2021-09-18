import { parseQueryString, stringifyQueryString } from '@showroomjs/core';
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { createNameContext } from './create-named-context';

const QueryParamContext = createNameContext<
  ReturnType<typeof useQueryParamsState> | undefined
>('QueryParamContext', undefined);

const useQueryParamsState = () => {
  const location = useLocation();
  const history = useHistory();

  const [{ value: paramValue, isReady }, setParamValue] = React.useState<{
    isReady: boolean;
    value: {
      [key: string]: string | undefined;
    };
  }>({
    isReady: false,
    value: {},
  });

  React.useEffect(() => {
    setParamValue({
      value: parseQueryString(location.search) as any,
      isReady: true,
    });
  }, []);

  const setQueryParams = React.useCallback(
    (newState: { [key: string]: string | undefined }) => {
      const newValue = {
        ...paramValue,
        ...newState,
      };

      setParamValue((value) => ({
        value: newValue,
        isReady: value.isReady,
      }));
      history.replace({
        search: stringifyQueryString(newValue),
      });
    },
    [paramValue]
  );

  return [paramValue, setQueryParams, isReady] as const;
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
