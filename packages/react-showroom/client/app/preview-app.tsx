import {
  decodeDisplayName,
  isFunction,
  isDefined,
  SupportedLanguage,
} from '@showroomjs/core';
import { Alert, useId, IdProvider, useConstant } from '@showroomjs/ui';
import * as React from 'react';
import allImports from 'react-showroom-all-imports';
import CodeblockData from 'react-showroom-codeblocks';
import Wrapper from 'react-showroom-wrapper';
import { AllComponents } from '../all-components';
import { CodePreviewFrame } from '../components/code-preview-frame';
import { CodeImportsContextProvider } from '../lib/code-imports-context';
import { CodeVariablesContextProvider } from '../lib/code-variables-context';
import { usePreviewWindow } from '../lib/frame-message';
import { Route, Switch, useParams } from '../lib/routing';
import { useHeightChange } from '../lib/use-height-change';
import { ConsoleContext, LogLevel } from '../lib/use-preview-console';
import { UseCustomStateContext } from '../lib/use-custom-state';

export const PreviewApp = () => {
  return (
    <IdProvider>
      <Wrapper>
        <CodeImportsContextProvider value={allImports}>
          <Switch>
            <Route path="/:codeHash/:component">
              <ComponentPreviewPage />
            </Route>
            <Route path="/:codeHash">
              <GenericPreviewPage />
            </Route>
            <Route>
              <ErrorPage />
            </Route>
          </Switch>
        </CodeImportsContextProvider>
      </Wrapper>
    </IdProvider>
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
    const componentDisplayName = decodeDisplayName(params.component);
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

const GenericPreviewPage = () => {
  return <PreviewPage />;
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

  const setStateMap = useConstant(
    () => new Map<string, React.Dispatch<React.SetStateAction<any>>>()
  );
  const latestStateValueMap = useConstant(() => new Map<string, any>());
  const customUseState = React.useMemo(
    () =>
      createCustomUseState({
        onChange: (value, id) =>
          sendParent({
            type: 'stateChange',
            stateValue: value,
            stateId: id,
          }),
        setStateMap,
        latestStateValueMap,
      }),
    []
  );

  const { sendParent } = usePreviewWindow((data) => {
    if (data.type === 'code') {
      setState(data);
    } else if (data.type === 'syncState') {
      const setStateFn = setStateMap.get(data.stateId);
      if (setStateFn) {
        setStateFn(data.stateValue);
      }
      latestStateValueMap.set(data.stateId, data.stateValue);
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

  const previewConsole = React.useMemo(() => {
    const addMessage = (level: LogLevel, ...msg: any[]) => {
      sendParent({
        type: 'log',
        level,
        data: msg,
      });
    };

    return Object.assign({}, console, {
      log: addMessage.bind(null, 'log'),
      error: addMessage.bind(null, 'error'),
      fatal: addMessage.bind(null, 'fatal'),
      warn: addMessage.bind(null, 'warn'),
      info: addMessage.bind(null, 'info'),
    });
  }, [sendParent]);

  return (
    <UseCustomStateContext.Provider value={customUseState as any}>
      <ConsoleContext.Provider value={previewConsole}>
        <CodePreviewFrame
          {...state}
          onIsCompilingChange={(isCompiling) =>
            sendParent({
              type: 'compileStatus',
              isCompiling,
            })
          }
        />
      </ConsoleContext.Provider>
    </UseCustomStateContext.Provider>
  );
};

const createCustomUseState =
  (options: {
    onChange: (value: any, id: string) => void;
    setStateMap: Map<string, React.Dispatch<React.SetStateAction<any>>>;
    latestStateValueMap: Map<string, any>;
  }) =>
  <S extends unknown>(
    initialState: S | (() => S)
  ): [S, React.Dispatch<React.SetStateAction<S>>] => {
    const stateId = useId();
    const latestStateValue = options.latestStateValueMap.get(stateId);
    const initialValue = isDefined(latestStateValue)
      ? (latestStateValue as S)
      : initialState;
    const [state, setState] = React.useState(initialValue);
    const latestValueRef = React.useRef(state);
    latestValueRef.current = state;

    React.useEffect(() => {
      options.setStateMap.set(stateId, setState);
    }, [stateId]);

    const customSetState = React.useMemo<
      React.Dispatch<React.SetStateAction<S>>
    >(
      () =>
        function customSetState(newState) {
          setState(newState);

          const nextState = isFunction(newState)
            ? newState(latestValueRef.current)
            : newState;

          options.onChange(nextState, stateId);
        },
      []
    );

    return [state, customSetState];
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
