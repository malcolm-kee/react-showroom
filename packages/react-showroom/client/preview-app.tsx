import { SupportedLanguage } from '@showroomjs/core';
import { Alert } from '@showroomjs/ui';
import { parse } from 'qs-lite';
import * as React from 'react';
import allImports from 'react-showroom-all-imports';
import Wrapper from 'react-showroom-wrapper';
import { CodePreviewFrame } from './components/code-preview-frame';
import { CodeImportsContextProvider } from './lib/code-imports-context';
import { usePreviewWindow } from './lib/frame-message';
import { Route, Switch, useLocation, useParams } from './lib/routing';
import { useHeightChange } from './lib/use-height-change';

export const PreviewApp = () => {
  return (
    <Wrapper>
      <CodeImportsContextProvider value={allImports}>
        <Switch>
          {/* TODO: use codeHash to load initial code so can server side rendering */}
          <Route path="/:codeHash">
            <PreviewPage />
          </Route>
          <Route>
            <ErrorPage />
          </Route>
        </Switch>
      </CodeImportsContextProvider>
    </Wrapper>
  );
};

export interface CodeState {
  code: string;
  lang: SupportedLanguage;
}

const defaultState: CodeState = {
  code: '',
  lang: 'tsx',
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
    typeof window === 'undefined' ? null : window.document.documentElement,
    (height) =>
      sendParent({
        type: 'heightChange',
        height,
      })
  );

  return <CodePreviewFrame {...state} />;
};

const ErrorPage = () => {
  return (
    <div>
      <Alert variant="error">
        Something goes wrong. This is probably a bug in{' '}
        <code>react-showroom</code>.
      </Alert>
    </div>
  );
};

const useQueryParams = <
  Params extends { [key: string]: string | string[] | undefined } = {
    [key: string]: string | undefined;
  }
>() => {
  const location = useLocation();

  const params = React.useMemo(
    () => getQueryParams(location.search),
    [location]
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
