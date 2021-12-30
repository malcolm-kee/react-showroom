import {
  isDefined,
  isFunction,
  isNumber,
  SupportedLanguage,
  noop,
} from '@showroomjs/core';
import { useMeasure } from '@showroomjs/measure';
import { Alert, useConstant, useId } from '@showroomjs/ui';
import * as React from 'react';
import allImports from 'react-showroom-all-imports';
import CodeblockData from 'react-showroom-codeblocks';
import allCompMetadata from 'react-showroom-comp-metadata?showroomAllComp';
import Wrapper from 'react-showroom-wrapper';
import { AllComponents } from '../all-components';
import { CodePreviewFrame } from '../components/code-preview-frame';
import { checkA11y } from '../lib/check-a11y';
import { CodeImportsContextProvider } from '../lib/code-imports-context';
import { CodeVariablesContextProvider } from '../lib/code-variables-context';
import { ComponentMetaContext } from '../lib/component-props-context';
import { usePreviewWindow } from '../lib/frame-message';
import { Route, Switch, useParams } from '../lib/routing';
import { UseCustomStateContext } from '../lib/use-custom-state';
import { useHeightChange } from '../lib/use-height-change';
import { ConsoleContext, LogLevel } from '../lib/use-preview-console';
import { useHighlights } from '../lib/use-highlights';
import {
  PropsEditorContext,
  PropsEditorState,
  serializePropsEditor,
} from '../lib/use-props-editor';

const componentsMetas = Object.values(allCompMetadata);

export const PreviewApp = () => {
  return (
    <Wrapper>
      <CodeImportsContextProvider value={allImports}>
        <Switch>
          <Route path="/:codeHash/:componentId">
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
  const params = useParams<{ componentId: string }>();
  const metadata = React.useMemo(
    () => componentsMetas.find((m) => m.id === params.componentId),
    [params.componentId]
  );

  const variables = React.useMemo(() => {
    if (!metadata) {
      return {};
    }

    const Component = AllComponents[metadata.displayName];

    return Component
      ? {
          [metadata.displayName]: Component,
        }
      : {};
  }, [metadata]);

  const content = (
    <CodeVariablesContextProvider value={variables}>
      <PreviewPage />
    </CodeVariablesContextProvider>
  );

  return metadata ? (
    <ComponentMetaContext.Provider value={metadata}>
      {content}
    </ComponentMetaContext.Provider>
  ) : (
    content
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

  const [measuring, setMeasuring] = React.useState(false);

  const isUpdatingRef = React.useRef(false);
  const isUpdatingTimerId = React.useRef<number | null>(null);

  const isFiringEventRef = React.useRef(false);
  const isFiringEventTimerId = React.useRef<number | null>(null);

  const [propsEditor, setPropsEditor] = React.useState<
    PropsEditorState | undefined
  >(undefined);

  const rootRef = React.useRef<HTMLDivElement>(null);

  const [color, setColor] = React.useState('');

  const highlightItems = useHighlights({ color });

  const { sendParent } = usePreviewWindow((ev) => {
    if (ev.type === 'code') {
      setState(ev);
    } else if (ev.type === 'syncState') {
      if (process.env.SYNC_STATE_TYPE === 'state') {
        const setStateFn = setStateMap.get(ev.stateId);
        if (setStateFn) {
          setStateFn(ev.stateValue);
        }
        latestStateValueMap.set(ev.stateId, ev.stateValue);
      }
    } else if (ev.type === 'scroll') {
      clearTimer(isUpdatingTimerId);

      const docEl = window.document.documentElement;

      if (docEl) {
        const [xPct, yPct] = ev.scrollPercentageXY;

        isUpdatingRef.current = true;

        if (isNumber(xPct)) {
          window.document.documentElement.scrollLeft = Math.round(
            xPct * (docEl.scrollWidth - docEl.clientWidth)
          );
        }

        if (isNumber(yPct)) {
          window.document.documentElement.scrollTop = Math.round(
            yPct * (docEl.scrollHeight - docEl.clientHeight)
          );
        }

        isUpdatingTimerId.current = window.setTimeout(() => {
          isUpdatingRef.current = false;
        }, 500);
      }
    } else if (ev.type === 'domEvent') {
      if (process.env.SYNC_STATE_TYPE === 'event') {
        clearTimer(isFiringEventTimerId);

        isFiringEventRef.current = true;

        import(/* webpackPrefetch: true */ '../lib/fire-event').then((m) =>
          m.fireValidDomEvent(ev.data)
        );

        isFiringEventTimerId.current = window.setTimeout(() => {
          isFiringEventRef.current = false;
        }, 500);
      }
    } else if (ev.type === 'syncPropsEditor') {
      setPropsEditor(ev.data);
    } else if (ev.type === 'toggleMeasure') {
      setMeasuring(ev.active);
    } else if (ev.type === 'requestA11yCheck') {
      if (rootRef.current) {
        checkA11y(rootRef.current).then((result) => {
          sendParent({
            type: 'a11yCheckResult',
            result,
          });
        });
      }
    } else if (ev.type === 'highlightElements') {
      highlightItems(ev.selectors);
      setColor(ev.color);
    }
  });

  React.useEffect(() => {
    if (rootRef.current) {
      let isCurrent = true;
      checkA11y(rootRef.current)
        .then((result) => {
          if (isCurrent) {
            sendParent({
              type: 'a11yCheckResult',
              result,
            });
          }
        })
        .catch(noop);
      return () => {
        isCurrent = false;
      };
    }
  });

  React.useEffect(() => {
    function getHeight() {
      if (isUpdatingRef.current) {
        return;
      }

      const docEl = window.document.documentElement;

      const xTotal = docEl.scrollWidth - docEl.clientWidth;
      const yTotal = docEl.scrollHeight - docEl.clientHeight;

      sendParent({
        type: 'scroll',
        scrollPercentageXY: [
          xTotal ? docEl.scrollLeft / xTotal : null,
          yTotal ? docEl.scrollTop / yTotal : null,
        ],
      });
    }

    window.addEventListener('scroll', getHeight);

    return () => window.removeEventListener('scroll', getHeight);
  }, []);

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
      if (typeof window !== 'undefined') {
        sendParent({
          type: 'log',
          level,
          data: msg,
        });
      }
    };

    return Object.assign({}, console, {
      log: addMessage.bind(null, 'log'),
      error: addMessage.bind(null, 'error'),
      fatal: addMessage.bind(null, 'fatal'),
      warn: addMessage.bind(null, 'warn'),
      info: addMessage.bind(null, 'info'),
    });
  }, [sendParent]);

  const createKeyboardEventHandler =
    (eventType: 'keyUp' | 'keyDown') => (ev: React.KeyboardEvent) => {
      if (process.env.SYNC_STATE_TYPE === 'state') {
        return;
      }

      if (isFiringEventRef.current) {
        return;
      }

      const domInfo = getDomEventInfo(ev);

      if (domInfo) {
        sendParent({
          type: 'domEvent',
          data: {
            ...domInfo,
            eventType,
            init: {
              key: ev.key,
              code: ev.code,
              keyCode: ev.keyCode,
              ctrlKey: ev.ctrlKey,
              shiftKey: ev.shiftKey,
              metaKey: ev.metaKey,
            },
          },
        });
      }
    };

  useMeasure({
    enabled: measuring,
  });

  return (
    <UseCustomStateContext.Provider
      value={
        process.env.SYNC_STATE_TYPE === 'state'
          ? (customUseState as any)
          : React.useState
      }
    >
      <ConsoleContext.Provider value={previewConsole}>
        <PropsEditorContext.Provider
          value={[
            propsEditor,
            function onPropsEditorEvent(ev) {
              if (ev.type === 'init') {
                sendParent({
                  type: 'syncPropsEditor',
                  data: serializePropsEditor(ev.initialState),
                });
              }
            },
          ]}
        >
          <CodePreviewFrame
            {...state}
            ref={rootRef}
            onIsCompilingChange={(isCompiling) =>
              sendParent({
                type: 'compileStatus',
                isCompiling,
              })
            }
            onChangeCapture={(ev) => {
              if (process.env.SYNC_STATE_TYPE === 'state') {
                return;
              }

              if (isFiringEventRef.current) {
                return;
              }

              const domInfo = getDomEventInfo(ev);

              if (domInfo) {
                const { value, checked, type, files } =
                  ev.target as HTMLInputElement;

                sendParent({
                  type: 'domEvent',
                  data: {
                    ...domInfo,
                    eventType: 'change',
                    init:
                      type === 'file'
                        ? {
                            target: {
                              files: files && Array.from(files),
                            },
                          }
                        : {
                            target: {
                              checked,
                              value,
                            },
                          },
                  },
                });
              }
            }}
            onClickCapture={(ev) => {
              if (process.env.SYNC_STATE_TYPE === 'state') {
                return;
              }

              if (isFiringEventRef.current) {
                return;
              }

              const domInfo = getDomEventInfo(ev);

              if (domInfo) {
                if (domInfo.tag === 'label') {
                  // fire this will cause double click on the associated input
                  return;
                }

                if (domInfo.tag === 'input') {
                  const { type } = ev.target as HTMLInputElement;

                  // fire this will cause all screen prompt for file selection.
                  if (type === 'file') {
                    return;
                  }
                }

                sendParent({
                  type: 'domEvent',
                  data: {
                    eventType: 'click',
                    ...domInfo,
                  },
                });
              }
            }}
            onKeyUpCapture={createKeyboardEventHandler('keyUp')}
            onKeyDownCapture={createKeyboardEventHandler('keyDown')}
          />
        </PropsEditorContext.Provider>
      </ConsoleContext.Provider>
    </UseCustomStateContext.Provider>
  );
};

const getDomEventInfo = (ev: React.SyntheticEvent) => {
  const el = ev.target as HTMLElement;

  const { tagName } = el;

  if (tagName) {
    const tag = tagName.toLowerCase();

    const allElements = Array.from(document.querySelectorAll(tag));

    return {
      tag,
      index: allElements.indexOf(el),
      tagTotal: allElements.length,
    };
  }
};

const clearTimer = (ref: React.RefObject<null | number>) => {
  const tValue = ref.current;

  if (isNumber(tValue)) {
    window.clearTimeout(tValue);
  }
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
