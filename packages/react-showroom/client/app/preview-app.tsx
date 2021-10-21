import { SupportedLanguage } from '@showroomjs/core';
import { Alert } from '@showroomjs/ui';
import * as React from 'react';
import allImports from 'react-showroom-all-imports';
import CodeblockData from 'react-showroom-codeblocks';
import Wrapper from 'react-showroom-wrapper';
import { CodePreviewFrame } from '../components/code-preview-frame';
import { CodeImportsContextProvider } from '../lib/code-imports-context';
import { CodeVariablesContextProvider } from '../lib/code-variables-context';
import { AllComponents } from '../all-components';
import { usePreviewWindow } from '../lib/frame-message';
import { Route, Switch, useParams } from '../lib/routing';
import { useHeightChange } from '../lib/use-height-change';

export const PreviewApp = () => {
  return (
    <Wrapper>
      <CodeImportsContextProvider value={allImports}>
        <Switch>
          <Route path="/:codeHash/:component">
            <ComponentPreviewPage />
          </Route>
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

const allCodeBlocks = CodeblockData.items.reduce((result, codeblock) =>
  Object.assign({}, result, codeblock)
);

const ComponentPreviewPage = () => {
  const params = useParams<{ component: string }>();

  const variables = React.useMemo(() => {
    const componentDisplayName = decodeURIComponent(params.component);
    const Component = AllComponents[componentDisplayName];

    return Component
      ? {
          [componentDisplayName]: Component,
        }
      : {};
  }, [params.component]);

  return (
    <CodeVariablesContextProvider value={variables}>
      <PreviewPage />
    </CodeVariablesContextProvider>
  );
};

const PreviewPage = () => {
  const params = useParams<{ codeHash: string }>();
  const codeData = React.useMemo(
    () =>
      Object.entries(allCodeBlocks).find(
        ([_, codeBlock]) =>
          codeBlock && codeBlock.initialCodeHash === params.codeHash
      ),
    [params.codeHash]
  );

  const [state, setState] = React.useState(
    codeData && codeData[1]
      ? {
          code: codeData[0],
          lang: codeData[1].lang,
        }
      : defaultState
  );

  const { sendParent } = usePreviewWindow((data) => {
    if (data.type === 'code') {
      setState(data);
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
