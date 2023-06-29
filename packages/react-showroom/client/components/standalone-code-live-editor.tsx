import {
  AdjustmentsVerticalIcon,
  ChatBubbleOvalLeftEllipsisIcon as ChatIcon,
  CodeBracketIcon,
  RectangleGroupIcon,
  CommandLineIcon,
  MagnifyingGlassPlusIcon,
} from '@heroicons/react/24/outline';
import {
  ChatBubbleOvalLeftEllipsisIcon as FilledChatIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid';
import {
  CompileResult,
  SupportedLanguage,
  isEqualArray,
} from '@showroomjs/core';
import {
  DropdownMenu,
  EditorBottomIcon,
  EditorRightIcon,
  IconButton,
  TextTooltip,
  ToggleButton,
  css,
  styled,
  tw,
  useDebounce,
  usePersistedState,
  useQueryParams,
} from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeFrameContext } from '../lib/code-frame-context';
import { useCodeTheme } from '../lib/code-theme-context';
import { safeCompress, safeDecompress } from '../lib/compress';
import { Suspense, lazy } from '../lib/lazy';
import { getScrollFn } from '../lib/scroll-into-view';
import { A11yResultByFrameContextProvider } from '../lib/use-a11y-result';
import { useCodeCompilationCache } from '../lib/use-code-compilation';
import { useCommentState } from '../lib/use-comment-state';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { PropsEditorProvider } from '../lib/use-props-editor';
import { useSize } from '../lib/use-size';
import { useStateWithParams } from '../lib/use-state-with-params';
import { useTargetAudience } from '../lib/use-target-audience';
import {
  A11yResultPanelForFrames,
  A11yResultPanelForFramesProps,
} from './a11y-result-panel-for-frames';
import { Div } from './base';
import { CheckboxDropdown } from './checkbox-dropdown';
import { CodeEditor } from './code-editor';
import { CodePreviewIframe } from './code-preview-iframe';
import { ConsolePanel } from './console-panel';
import { PropsEditorPanel } from './props-editor-panel';
import { RadioDropdown } from './radio-dropdown';
import { CommentList } from './standalone-code-live-editor-comment';
import { StandaloneCodeLiveEditorCommentPopover } from './standalone-code-live-editor-comment-popover';
import { StandaloneCodeLiveEditorCopyButton } from './standalone-code-live-editor-copy-button';
import { StandaloneCodeLiveEditorPreviewList } from './standalone-code-live-editor-preview';

const CodeAdvancedEditor = lazy(() =>
  import('./code-advanced-editor').then((m) => ({
    default: m.CodeAdvancedEditor,
  }))
);

type Dimension = [width: number, height: number | '100%'];

export interface StandaloneCodeLiveEditorProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string;
  className?: string;
}

export const StandaloneCodeLiveEditor = ({
  className,
  ...props
}: StandaloneCodeLiveEditorProps) => {
  const theme = useCodeTheme();

  const [queryParams, setQueryParams] = useQueryParams();

  const [isCodeParsed, setIsCodeParsed] = React.useState(false);

  const {
    state: commentState,
    add,
    remove,
    clear,
  } = useCommentState(props.codeHash);
  const [activeComment, setActiveComment] = React.useState('');
  React.useEffect(() => {
    if (activeComment) {
      let isCurrent = true;
      getScrollFn().then((scroll) => {
        if (isCurrent) {
          const target = document.querySelector('[data-active-comment]');
          if (target) {
            scroll(target, {
              scrollMode: 'if-needed',
            });
          }
        }
      });
      return () => {
        isCurrent = false;
      };
    }
  }, [activeComment]);

  const [code, setCode] = React.useState(props.code);
  const [showEditor, setShowEditor] = useStateWithParams(
    true,
    'hideEditor',
    (paramValue) => !paramValue
  );

  const [zoomLevel, setZoomLevel] = useStateWithParams('75', 'zoom', (x) => x);

  const [hiddenSizes, _setHiddenSizes] = usePersistedState<Array<Dimension>>(
    [],
    'hiddenSizes'
  );
  const setHiddenSizes = (sizes: Array<Dimension>) => {
    _setHiddenSizes(sizes);

    setQueryParams(
      {
        hiddenSizes:
          sizes.length > 0
            ? sizes.map((s) => `${s[0]}x${s[1]}`).join('_')
            : undefined,
      },
      {
        merge: true,
      }
    );
  };

  const { frameDimensions, showDeviceFrame: showDeviceFrameSetting } =
    useCodeFrameContext();
  const showMultipleScreens = frameDimensions.length > 0;

  const [showDeviceFrame, setShowDeviceFrame] = useStateWithParams(
    showDeviceFrameSetting,
    'showFrame',
    (value) => value === 'true'
  );

  React.useEffect(() => {
    const codeValue = queryParams.get('code');
    const hiddenSizesValue = queryParams.get('hiddenSizes');

    if (codeValue) {
      setCode(safeDecompress(codeValue, props.code));
    }
    if (hiddenSizesValue) {
      const serializedHiddenSizes = hiddenSizesValue
        .split('_')
        .map((xAndY) => xAndY.split('x').map(Number))
        .filter(
          (v) =>
            v.length === 2 &&
            v.every((n) => !isNaN(n)) &&
            frameDimensions.some((d) => d.width === v[0] && d.height === v[1])
        );

      if (serializedHiddenSizes.length > 0) {
        _setHiddenSizes(serializedHiddenSizes as any as Array<Dimension>);
      }
    }

    setIsCodeParsed(true);
  }, []);

  const debouncedCode = useDebounce(code);

  React.useEffect(() => {
    setQueryParams(
      {
        code:
          debouncedCode !== props.code
            ? safeCompress(debouncedCode)
            : undefined,
      },
      { merge: true }
    );
  }, [debouncedCode]);

  const [isCommenting, _setIsCommenting] = useStateWithParams(
    false,
    'commentMode',
    (v) => !!v
  );
  const setIsCommenting = (isCommentMode: boolean) => {
    _setIsCommenting(isCommentMode, isCommentMode ? 'true' : undefined);

    if (isCommentMode) {
      setIsMeasuring(false);
    } else {
      clear();
    }
  };

  const previewListRef = React.useRef<HTMLDivElement>(null);
  const [targetCoord, setTargetCoord] = React.useState<Coord | undefined>(
    undefined
  );

  const displayedComments = React.useMemo(
    () =>
      commentState.items.filter(
        (item) =>
          item.zoomLevel === zoomLevel &&
          isEqualArray(item.hiddenSizes, hiddenSizes, { ignoreOrder: true }) &&
          item.showFrame === showDeviceFrame
      ),
    [commentState.items, zoomLevel, hiddenSizes]
  );

  const targetAudience = useTargetAudience();
  const [syncState, setSyncState] = usePersistedState(
    targetAudience === 'developer',
    'syncState'
  );

  const [syncScroll, setSyncScroll] = usePersistedState(true, 'syncScroll');

  const [_useAdvancedEditor, setUseAdvancedEditor] = usePersistedState(
    false,
    'useAdvancedEditor'
  );
  const useAdvancedEditor =
    process.env.ENABLE_ADVANCED_EDITOR && _useAdvancedEditor;

  const [isMeasuring, setIsMeasuring] = React.useState(false);

  const initialCompilation = useCodeCompilationCache(props.code, props.lang);

  const isPropsEditor = React.useMemo(
    () =>
      initialCompilation.data &&
      initialCompilation.data.type === 'success' &&
      initialCompilation.data.features.some(
        (f) => f.feature === 'propsEditor' && !f.hasRenderEditor
      ),
    [initialCompilation.data]
  );

  const [wrapPreview, setWrapPreview] = usePersistedState(false, 'wrapPreview');

  const [editorPosition, setEditorPosition] = usePersistedState<
    'bottom' | 'right'
  >('right', 'editorPosition');

  const isDockToRight = editorPosition === 'right';

  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const toolbarSize = useSize(toolbarRef);

  const [a11yTab, setA11yTab] = React.useState(() =>
    frameDimensions.length > 0 ? frameDimensions[0].name : ''
  );

  const [higlightedEls, setHighlightedEls] = React.useState<
    { frameName: string; selectors: string[]; color: string } | undefined
  >(undefined);
  const resetHighlights = () =>
    setHighlightedEls(
      (prev) =>
        prev && {
          ...prev,
          selectors: [],
          color: '',
        }
    );

  const codeEditorShouldDisplay = showEditor && !isCommenting && !isPropsEditor;

  return (
    <PreviewConsoleProvider>
      <A11yResultByFrameContextProvider>
        <Div css={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Toolbar
            style={{
              top: 'var(--header-height, 0px)',
            }}
            ref={toolbarRef}
          >
            <Div
              css={{
                display: 'flex',
              }}
            >
              <Div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '$2',
                  paddingRight: '$2',
                  borderRight: '1px solid $gray-200',
                }}
              >
                <TextTooltip label="Comment">
                  <PrimaryToggleButton
                    pressed={isCommenting}
                    onPressedChange={setIsCommenting}
                    data-testid="comment-toggle"
                  >
                    {isCommenting ? <CommentOnIcon /> : <CommentIcon />}
                  </PrimaryToggleButton>
                </TextTooltip>
                {showMultipleScreens && (
                  <>
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <MenuButton data-testid="setting-menu">
                          <ScreensIcon width={20} height={20} />
                        </MenuButton>
                      </DropdownMenu.Trigger>
                      <CheckboxDropdown>
                        <DropdownMenu.Label>Screens</DropdownMenu.Label>
                        {frameDimensions.map((frame) => {
                          return (
                            <CheckboxDropdown.Item
                              checked={
                                !hiddenSizes.some(
                                  ([w, h]) =>
                                    w === frame.width && h === frame.height
                                )
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setHiddenSizes(
                                    hiddenSizes.filter(
                                      (s) =>
                                        !(
                                          s[0] === frame.width &&
                                          s[1] === frame.height
                                        ) && frameDimensions.includes(frame)
                                    )
                                  );
                                } else {
                                  setHiddenSizes(
                                    hiddenSizes.concat([
                                      [frame.width, frame.height],
                                    ])
                                  );
                                }
                              }}
                              key={frame.name}
                            >
                              {frame.name}
                            </CheckboxDropdown.Item>
                          );
                        })}
                        <DropdownMenu.Separator />
                        {showDeviceFrameSetting && (
                          <CheckboxDropdown.Item
                            checked={showDeviceFrame}
                            onCheckedChange={(showFrame) =>
                              setShowDeviceFrame(
                                showFrame,
                                showFrame ? undefined : 'false'
                              )
                            }
                          >
                            Device Frame
                          </CheckboxDropdown.Item>
                        )}
                        {!isCommenting && (
                          <CheckboxDropdown.Item
                            checked={wrapPreview}
                            onCheckedChange={setWrapPreview}
                          >
                            Wrap Screens
                          </CheckboxDropdown.Item>
                        )}
                        {(showDeviceFrameSetting || !isCommenting) && (
                          <DropdownMenu.Separator />
                        )}
                        {!isCommenting && (
                          <CheckboxDropdown.Item
                            checked={syncState}
                            onCheckedChange={setSyncState}
                          >
                            {process.env.SYNC_STATE_TYPE === 'state'
                              ? 'Sync State'
                              : 'Sync Interactions'}
                          </CheckboxDropdown.Item>
                        )}
                        <CheckboxDropdown.Item
                          checked={syncScroll}
                          onCheckedChange={setSyncScroll}
                        >
                          Sync Scroll
                        </CheckboxDropdown.Item>
                      </CheckboxDropdown>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <MenuButton>
                          <span className={tw(['sr-only sm:not-sr-only'])}>
                            {zoomLevel}%{' '}
                          </span>
                          <ZoomIcon width={20} height={20} />
                        </MenuButton>
                      </DropdownMenu.Trigger>
                      <RadioDropdown
                        value={zoomLevel}
                        onChangeValue={(level) =>
                          setZoomLevel(
                            level,
                            level === '75' ? undefined : level
                          )
                        }
                        options={zoomOptions}
                        className={zoomDropdown()}
                        align="end"
                      />
                    </DropdownMenu>
                  </>
                )}
              </Div>
              {!isCommenting && (
                <Div
                  css={{
                    px: '$1',
                  }}
                >
                  <TextTooltip label="Measure">
                    <PrimaryToggleButton
                      pressed={isMeasuring}
                      onPressedChange={setIsMeasuring}
                      data-testid="measure-toggle"
                    >
                      <MeasureIcon
                        active={isMeasuring}
                        width={20}
                        height={20}
                      />
                    </PrimaryToggleButton>
                  </TextTooltip>
                </Div>
              )}
            </Div>
            <Div
              css={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '$1',
              }}
            >
              <StandaloneCodeLiveEditorCopyButton
                getTextToCopy={() => {
                  if (window) {
                    return window.location.href;
                  }
                  return '';
                }}
              />
            </Div>
          </Toolbar>
          <PropsEditorProvider codeHash={props.codeHash} serializeToParam>
            <Div
              className={className}
              css={{
                display: 'flex',
                backgroundColor: '$gray-200',
                flex: 1,
                flexDirection: 'column',
                ...(isDockToRight
                  ? {
                      '@md': {
                        flexDirection: 'row',
                        width: '100%',
                        flex: 'none',
                        height: toolbarSize
                          ? `calc(100vh - var(--header-height, 64px) - var(--breadcrumb-height, 0px) - ${toolbarSize.height}px)`
                          : undefined,
                      },
                    }
                  : {}),
              }}
            >
              <Div
                css={
                  isDockToRight
                    ? {
                        '@md': {
                          flex: 1,
                          overflow: 'auto',
                          overscrollBehavior: 'contain',
                        },
                      }
                    : undefined
                }
              >
                {showMultipleScreens ? (
                  <StandaloneCodeLiveEditorPreviewList
                    code={debouncedCode}
                    lang={props.lang}
                    codeHash={props.codeHash}
                    isCommenting={isCommenting}
                    isMeasuring={isMeasuring}
                    hiddenSizes={hiddenSizes}
                    fitHeight={showDeviceFrame && (!showEditor || isCommenting)}
                    zoom={zoomLevel}
                    showFrame={showDeviceFrame}
                    onClickCommentPoint={(coord) => {
                      const previewList = previewListRef.current;

                      if (previewList) {
                        const listRect = previewList.getBoundingClientRect();

                        const listX = listRect.left + window.pageXOffset;
                        const listY = listRect.top + window.pageYOffset;
                        const elementRelative = {
                          x: coord.x - listX + previewList.scrollLeft,
                          y: coord.y - listY + previewList.scrollTop,
                        };

                        setTargetCoord(elementRelative);

                        setActiveComment('');
                      }
                    }}
                    ref={previewListRef}
                    syncState={syncState}
                    syncScroll={syncScroll}
                    onA11ySummaryClick={setA11yTab}
                    a11yHighlightData={higlightedEls}
                    wrapContent={!isCommenting && wrapPreview}
                  >
                    {isCommenting && targetCoord ? (
                      <StandaloneCodeLiveEditorCommentPopover
                        open
                        onOpenChange={(shouldOpen) => {
                          if (!shouldOpen) {
                            setTargetCoord(undefined);
                          }
                        }}
                        onAdd={(newComment) => {
                          add({
                            text: newComment,
                            zoomLevel,
                            hiddenSizes: hiddenSizes,
                            left: targetCoord.x,
                            top: targetCoord.y,
                            showFrame: showDeviceFrame,
                          });
                          setTargetCoord(undefined);
                        }}
                      >
                        <Marker
                          style={{
                            position: 'absolute',
                            top: targetCoord.y,
                            left: targetCoord.x,
                          }}
                        />
                      </StandaloneCodeLiveEditorCommentPopover>
                    ) : null}
                    {isCommenting &&
                      displayedComments.map((comment) => {
                        const isActive = comment.id === activeComment;
                        return (
                          <Div
                            css={{
                              position: 'absolute',
                              top: comment.top,
                              left: comment.left,
                              pointerEvents: 'auto',
                              cursor: 'pointer',
                              width: 20,
                              height: 20,
                              zIndex: 5,
                            }}
                            key={comment.id}
                          >
                            <TextTooltip
                              open={isActive}
                              label={comment.text}
                              side="top"
                              className={commentPopover()}
                            >
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setActiveComment(isActive ? '' : comment.id);
                                }}
                                type="button"
                                className={tw([
                                  'flex justify-center items-center m-[-10px] w-10 h-10 rounded-lg',
                                ])}
                              >
                                <Marker
                                  iconClass={iconClass({
                                    active: isActive,
                                  })}
                                  data-active-comment={isActive ? true : null}
                                />
                              </button>
                            </TextTooltip>
                          </Div>
                        );
                      })}
                    {isCommenting && (
                      <Div
                        onClick={(ev) => ev.stopPropagation()}
                        css={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 12,
                          pointerEvents: 'auto',
                        }}
                      />
                    )}
                  </StandaloneCodeLiveEditorPreviewList>
                ) : (
                  <CodePreviewIframe
                    code={debouncedCode}
                    lang={props.lang}
                    codeHash={props.codeHash}
                  />
                )}
                <ConsolePanel />
              </Div>
              <Div
                css={{
                  display: 'flex',
                  background: 'White',
                  ...(isDockToRight
                    ? {
                        '@md': isCommenting
                          ? {
                              minWidth: '23.5rem',
                            }
                          : {
                              width: '30rem',
                              borderLeft: '1px solid $gray-200',
                            },
                      }
                    : {}),
                }}
              >
                <Div
                  css={{
                    flex: 1,
                    ...(isDockToRight
                      ? {
                          '@md': {
                            display: 'flex',
                            flexDirection: 'column',
                          },
                        }
                      : {}),
                  }}
                >
                  {!isCommenting && isPropsEditor && (
                    <PropsEditorPanel className={tw(['flex-1'])} />
                  )}
                  {codeEditorShouldDisplay &&
                    (useAdvancedEditor ? (
                      isCodeParsed && (
                        <Div
                          css={{
                            flex: 1,
                            overflow: 'hidden',
                            height: `${code.split(/\r\n|\r|\n/).length + 3}rem`,
                            ...(isDockToRight
                              ? {
                                  '@md': {
                                    height: '100%',
                                  },
                                }
                              : {}),
                          }}
                        >
                          <AdvancedEditor
                            value={code}
                            onChange={setCode}
                            language={props.lang as Language}
                            initialResult={initialCompilation.data}
                            key={isDockToRight ? 0 : 1}
                          />
                        </Div>
                      )
                    ) : (
                      <CodeEditor
                        code={code}
                        onChange={setCode}
                        language={props.lang as Language}
                        theme={theme}
                        className={editor()}
                        wrapperClass={editorWrapper()}
                      />
                    ))}
                  {!isCommenting && (
                    <A11yPanel
                      activeTab={a11yTab}
                      setActiveTab={setA11yTab}
                      onHighlightItems={setHighlightedEls}
                      resetHiglights={resetHighlights}
                      scrollToFrameWhenSelect={isDockToRight}
                    />
                  )}
                </Div>
                {isCommenting && (
                  <Div
                    css={{
                      width: '100%',
                      backgroundColor: '$gray-100',
                      height: 200,
                      '@md': isDockToRight
                        ? {
                            height: '100%',
                          }
                        : {},
                    }}
                  >
                    {commentState.items.length > 0 ? (
                      <CommentList>
                        {commentState.items.map((comment) => (
                          <CommentList.Item
                            active={comment.id === activeComment}
                            onClick={() => {
                              setHiddenSizes(comment.hiddenSizes);
                              setZoomLevel(
                                comment.zoomLevel,
                                comment.zoomLevel === '100'
                                  ? undefined
                                  : comment.zoomLevel
                              );
                              if (showDeviceFrameSetting) {
                                setShowDeviceFrame(
                                  comment.showFrame,
                                  comment.showFrame ? undefined : 'false'
                                );
                              }
                              setActiveComment(comment.id);
                            }}
                            onDismiss={() => remove(comment.id)}
                            key={comment.id}
                          >
                            {comment.text}
                          </CommentList.Item>
                        ))}
                      </CommentList>
                    ) : (
                      <p
                        className={tw([
                          'text-sm m-1 p-2 max-w-xs mx-auto text-zinc-600',
                        ])}
                      >
                        No comment added.
                        <br />
                        Click on any point of the preview to start adding
                        comment.
                      </p>
                    )}
                  </Div>
                )}
                <Div
                  css={{
                    display: 'flex',
                    flexFlow: 'column',
                    gap: '$2',
                    padding: '$2',
                    borderLeft: '1px solid $gray-200',
                  }}
                >
                  <TextTooltip
                    label={isDockToRight ? 'Dock to right' : 'Dock to bottom'}
                  >
                    <IconButton
                      data-testid="editor-position-button"
                      onClick={() =>
                        setEditorPosition(
                          editorPosition === 'bottom' ? 'right' : 'bottom'
                        )
                      }
                      className={tw(['!hidden md:!inline-flex'])}
                      flat
                    >
                      {isDockToRight ? (
                        <EditorRightIcon />
                      ) : (
                        <EditorBottomIcon />
                      )}
                    </IconButton>
                  </TextTooltip>
                  {!isCommenting && !isPropsEditor && (
                    <TextTooltip label="Code Editor">
                      <ToggleButton
                        pressed={showEditor}
                        onPressedChange={(show) =>
                          setShowEditor(show, show ? undefined : 'true')
                        }
                        className={tw(['rounded-full'])}
                        css={
                          showEditor
                            ? {
                                color: '$gray-600',
                                backgroundColor: '$gray-100',
                                shadow: 'inner',
                              }
                            : {
                                color: '$gray-400',
                              }
                        }
                        data-testid="editor-toggle"
                      >
                        <CodeBracketIcon width={24} height={24} />
                      </ToggleButton>
                    </TextTooltip>
                  )}
                  {process.env.ENABLE_ADVANCED_EDITOR &&
                    codeEditorShouldDisplay && (
                      <TextTooltip label="Advanced Editor">
                        <ToggleButton
                          pressed={useAdvancedEditor}
                          onPressedChange={setUseAdvancedEditor}
                          css={{
                            display: 'none',
                            '@md': {
                              display: 'flex',
                            },
                            ...(useAdvancedEditor
                              ? {
                                  color: '$gray-600',
                                  backgroundColor: '$gray-100',
                                  shadow: 'inner',
                                }
                              : {
                                  color: '$gray-400',
                                }),
                          }}
                          data-testid="advanced-editor-toggle"
                        >
                          <CommandLineIcon width={24} height={24} />
                        </ToggleButton>
                      </TextTooltip>
                    )}
                </Div>
              </Div>
            </Div>
          </PropsEditorProvider>
        </Div>
      </A11yResultByFrameContextProvider>
    </PreviewConsoleProvider>
  );
};

const A11yPanel = (props: A11yResultPanelForFramesProps) => (
  <section
    className={tw(['px-2 pb-3 min-h-[200px] max-h-[40vh] overflow-y-auto'])}
  >
    <div
      className={tw([
        'text-lg px-2 pt-2 pb-1 border-t border-zinc-200 font-medium',
      ])}
    >
      Accessibility
    </div>
    <A11yResultPanelForFrames {...props} />
  </section>
);

interface AdvancedEditorProps {
  value: string;
  onChange: (code: string) => void;
  language: Language;
  initialResult: CompileResult | undefined;
}

function AdvancedEditor(props: AdvancedEditorProps) {
  if (process.env.ENABLE_ADVANCED_EDITOR) {
    return (
      <Suspense fallback={null}>
        <CodeAdvancedEditor {...props} />
      </Suspense>
    );
  }

  return null;
}

const zoomOptions = [
  {
    value: '20',
    label: '20%',
  },
  {
    value: '30',
    label: '30%',
  },
  {
    value: '40',
    label: '40%',
  },
  {
    value: '50',
    label: '50%',
  },
  {
    value: '75',
    label: '75%',
  },
  {
    value: '100',
    label: '100%',
  },
  {
    value: '110',
    label: '110%',
  },
  {
    value: '125',
    label: '125%',
  },
];

const zoomDropdown = css({
  minWidth: '80px !important',
});

interface MarkerProps extends React.ComponentPropsWithoutRef<'span'> {
  iconClass?: string;
}

const Marker = React.forwardRef<HTMLSpanElement, MarkerProps>(function Marker(
  { iconClass, ...props },
  forwardedRef
) {
  return (
    <span
      {...props}
      className={tw(['inline-block w-5 h-5'], [props.className])}
      ref={forwardedRef}
    >
      <MapPinIcon
        width={20}
        height={20}
        className={tw(['w-5 h-5 text-zinc-500'], [iconClass])}
      />
    </span>
  );
});

const PrimaryToggleButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ToggleButton>
>(function PrimaryToggleButton(props, forwardedRef) {
  return (
    <ToggleButton
      {...props}
      className={tw(['aria-pressed:bg-primary-700'], [props.className])}
      ref={forwardedRef}
    />
  );
});

const Toolbar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: '$3',
  backgroundColor: 'White',
  borderBottom: '1px solid $gray-200',
  position: 'sticky',
  zIndex: 1,
});

const CommentIcon = styled(ChatIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const CommentOnIcon = styled(FilledChatIcon, {
  width: 20,
  height: 20,
  color: 'White',
});

const MeasureIcon = styled(RectangleGroupIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
  variants: {
    active: {
      true: {
        color: 'White',
      },
    },
  },
});

const ZoomIcon = styled(MagnifyingGlassPlusIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const ScreensIcon = styled(AdjustmentsVerticalIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const MenuButton = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  px: '$2',
  py: '$1',
  borderRadius: '$sm',
  outlineRing: '$primary-200',
});

const editorWrapper = css({
  flex: 1,
  overflow: 'auto',
});

const editor = css({
  borderRadius: '$base',
});

const commentPopover = css({
  whiteSpace: 'pre-wrap',
});

const iconClass = css({
  transform: 'scale(1)',
  transition: 'transform 150ms ease-in-out',
  transformOrigin: 'bottom center',
  variants: {
    active: {
      true: {
        color: '$primary-500',
        transform: 'scale(1.5)',
      },
    },
  },
});

interface Coord {
  x: number;
  y: number;
}
