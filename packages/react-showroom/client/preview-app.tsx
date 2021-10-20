import { SupportedLanguage } from '@showroomjs/core';
import { parse } from 'qs-lite';
import * as React from 'react';
import allImports from 'react-showroom-all-imports';
import Wrapper from 'react-showroom-wrapper';
import { CodePreviewFrame } from './components/code-preview-frame';
import { CodeImportsContextProvider } from './lib/code-imports-context';
import { usePreviewWindow } from './lib/frame-message';
import { Route, useParams } from './lib/routing';
import { useHeightChange } from './lib/use-height-change';

export interface CodeState {
  code: string;
  lang: SupportedLanguage;
}

const defaultState: CodeState = {
  code: '',
  lang: 'tsx',
};

export const PreviewApp = () => {
  return (
    <Wrapper>
      <CodeImportsContextProvider value={allImports}>
        {/* TODO: use codeHash to load initial code so can server side rendering */}
        <Route path="/:codeHash">
          <PreviewPage />
        </Route>
      </CodeImportsContextProvider>
    </Wrapper>
  );
};

const PreviewPage = () => {
  const queryParams = useQueryParams();
  const code = React.useMemo(
    () => queryParams.code && decodeURIComponent(queryParams.code),
    [queryParams.code]
  );

  const params = useParams<{ codeHash: string }>();

  if (!params.codeHash) {
    console.log(params);
  }

  const [state, setState] = React.useState(
    code && queryParams.lang
      ? {
          code,
          lang: queryParams.lang as SupportedLanguage,
        }
      : defaultState
  );

  const { sendParent } = usePreviewWindow((data) => {
    if (data.type === 'code') {
      setState(data as any as CodeState);
    }
  });

  useHeightChange(
    typeof window === 'undefined' ? null : window.document.body,
    (height) =>
      sendParent({
        type: 'heightChange',
        height,
      })
  );

  return <CodePreviewFrame {...state} />;
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
