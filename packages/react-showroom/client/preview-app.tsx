import { SupportedLanguage } from '@showroomjs/core';
import { parse } from 'qs-lite';
import * as React from 'react';
import { imports } from 'react-showroom-imports';
import Wrapper from 'react-showroom-wrapper';
import { CodePreviewFrame } from './components/code-preview-frame';
import { CodeImportsContextProvider } from './lib/code-imports-context';
import { useChildFrame } from './lib/frame-message';

export interface CodeState {
  code: string;
  lang: SupportedLanguage;
}

const defaultState: CodeState = {
  code: '',
  lang: 'tsx',
};

export const PreviewApp = () => {
  const queryParams = useQueryParams();
  const code = React.useMemo(
    () => queryParams.code && decodeURIComponent(queryParams.code),
    [queryParams.code]
  );
  const [state, setState] = React.useState(
    code && queryParams.lang
      ? {
          code,
          lang: queryParams.lang as SupportedLanguage,
        }
      : defaultState
  );

  useChildFrame((data) => {
    if (data.type === 'code') {
      setState(data as any as CodeState);
    }
  });

  return (
    <Wrapper>
      <CodeImportsContextProvider value={imports}>
        <CodePreviewFrame {...state} />
      </CodeImportsContextProvider>
    </Wrapper>
  );
};

const useQueryParams = <
  Params extends { [key: string]: string | string[] | undefined } = {
    [key: string]: string | undefined;
  }
>() => {
  const params = React.useMemo(
    () => getQueryParams(location.search),
    [location.search]
  );

  return params as Params;
};

function getQueryParams(search: string) {
  if (search) {
    if (search.indexOf('?') === 0) {
      return parse(search.substring(1));
    }
  }
  return {};
}
