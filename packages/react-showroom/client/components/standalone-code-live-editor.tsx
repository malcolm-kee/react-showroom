import {
  AdjustmentsIcon,
  AnnotationIcon,
  CodeIcon,
  EyeIcon,
  RefreshIcon,
  TemplateIcon,
  TerminalIcon,
  ZoomInIcon,
} from '@heroicons/react/outline';
import {
  AnnotationIcon as FilledAnnotationIcon,
  DeviceMobileIcon,
  LocationMarkerIcon,
  ReplyIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/solid';
import {
  CompileResult,
  isEqualArray,
  SupportedLanguage,
} from '@showroomjs/core';
import {
  css,
  DropdownMenu,
  EditorBottomIcon,
  EditorRightIcon,
  IconButton,
  styled,
  TextTooltip,
  ToggleButton,
  useDebounce,
  usePersistedState,
  useQueryParams,
} from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeFrameContext } from '../lib/code-frame-context';
import { useCodeTheme } from '../lib/code-theme-context';
import { safeCompress, safeDecompress } from '../lib/compress';
import { lazy, Suspense } from '../lib/lazy';
import { getScrollFn } from '../lib/scroll-into-view';
import { useCodeCompilationCache } from '../lib/use-code-compilation';
import { useCommentState } from '../lib/use-comment-state';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { PropsEditorProvider } from '../lib/use-props-editor';
import { useSize } from '../lib/use-size';
import { useStateWithParams } from '../lib/use-state-with-params';
import { useTargetAudience } from '../lib/use-target-audience';
import { Div } from './base';
import { CheckboxDropdown } from './checkbox-dropdown';
import { CodeEditor } from './code-editor';
import { CodePreviewIframe } from './code-preview-iframe';
import { ConsolePanel } from './console-panel';
import { PropsEditorPanel } from './props-editor-panel';
import { RadioDropdown } from './radio-dropdown';
import { CommentList } from './standalone-code-live-editor-comment';
import { StandaloneCodeLiveEditorCommentPopover } from './standalone-code-live-editor-comment-popover';
import {
  BtnText,
  StandaloneCodeLiveEditorCopyButton,
} from './standalone-code-live-editor-copy-button';
import { StandaloneCodeLiveEditorPreviewList } from './standalone-code-live-editor-preview';
import { A11yResultByFrameContextProvider } from '../lib/use-a11y-result';
import {
  A11yResultPanelForFrames,
  A11yResultPanelForFramesProps,
} from './a11y-result-panel-for-frames';

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

  const [queryParams, setQueryParams, isReady] = useQueryParams();

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

  const [showPreview, setShowPreview] = useStateWithParams(
    true,
    'hidePreview',
    (paramValue) => !paramValue
  );
  const [zoomLevel, setZoomLevel] = useStateWithParams('75', 'zoom', (x) => x);

  const [hiddenSizes, _setHiddenSizes] = usePersistedState<Array<Dimension>>(
    [],
    'hiddenSizes'
  );
  const setHiddenSizes = (sizes: Array<Dimension>) => {
    _setHiddenSizes(sizes);
    setQueryParams({
      hiddenSizes:
        sizes.length === 0
          ? undefined
          : sizes.map((s) => `${s[0]}x${s[1]}`).join('_'),
    });
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
    if (isReady) {
      if (queryParams.code) {
        setCode(safeDecompress(queryParams.code as string, props.code));
      }
      if (queryParams.hiddenSizes) {
        const serializedHiddenSizes = queryParams.hiddenSizes
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
    }
  }, [isReady]);

  const debouncedCode = useDebounce(code);

  React.useEffect(() => {
    setQueryParams({
      code:
        debouncedCode === props.code ? undefined : safeCompress(debouncedCode),
    });
  }, [debouncedCode]);

  const [isCommenting, setIsCommenting] = useStateWithParams(
    false,
    'commentMode',
    (v) => !!v
  );

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

  const [useAdvancedEditor, setUseAdvancedEditor] = usePersistedState(
    false,
    'useAdvancedEditor'
  );

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
  >('bottom', 'editorPosition');

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
                  <ToggleButton
                    pressed={isCommenting}
                    onPressedChange={(isCommentMode) => {
                      setIsCommenting(
                        isCommentMode,
                        isCommentMode ? 'true' : undefined
                      );

                      if (!isCommentMode) {
                        clear();
                      }
                    }}
                    css={
                      isCommenting
                        ? {
                            backgroundColor: '$primary-700',
                          }
                        : undefined
                    }
                    data-testid="comment-toggle"
                  >
                    {isCommenting ? <CommentOnIcon /> : <CommentIcon />}
                  </ToggleButton>
                </TextTooltip>
              </Div>
              {!isCommenting && !isPropsEditor && (
                <Div
                  css={{
                    display: 'flex',
                    gap: '$2',
                    px: '$2',
                    borderRight: '1px solid $gray-200',
                  }}
                >
                  <TextTooltip label="Editor">
                    <ToggleButton
                      pressed={showEditor}
                      onPressedChange={(show) =>
                        setShowEditor(show, show ? undefined : 'true')
                      }
                      css={
                        showEditor
                          ? {
                              color: '$gray-600',
                              backgroundColor: '$gray-100',
                            }
                          : undefined
                      }
                      data-testid="editor-toggle"
                    >
                      <CodeIcon width={20} height={20} />
                    </ToggleButton>
                  </TextTooltip>
                  {process.env.ENABLE_ADVANCED_EDITOR
                    ? showEditor && (
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
                                  }
                                : {}),
                            }}
                            data-testid="advanced-editor-toggle"
                          >
                            <TerminalIcon width={20} height={20} />
                          </ToggleButton>
                        </TextTooltip>
                      )
                    : null}
                  <TextTooltip label="Preview">
                    <ToggleButton
                      pressed={showPreview}
                      onPressedChange={(show) =>
                        setShowPreview(show, show ? undefined : 'true')
                      }
                      disabled={isCommenting}
                      css={
                        showPreview
                          ? {
                              color: '$gray-600',
                              backgroundColor: '$gray-100',
                            }
                          : undefined
                      }
                      data-testid="preview-toggle"
                    >
                      <EyeIcon width={20} height={20} />
                    </ToggleButton>
                  </TextTooltip>
                </Div>
              )}
              <Div
                css={{
                  display: 'block',
                  px: '$2',
                  '@sm': {
                    display: 'none',
                  },
                }}
              >
                {showMultipleScreens && (showPreview || isCommenting) && (
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <MenuButton>
                        <ScreensIcon width={20} height={20} />
                      </MenuButton>
                    </DropdownMenu.Trigger>
                    <CheckboxDropdown>
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
                    </CheckboxDropdown>
                  </DropdownMenu>
                )}
              </Div>
              {showMultipleScreens && (showPreview || isCommenting) && (
                <Div
                  css={{
                    display: 'none',
                    '@sm': {
                      display: 'flex',
                      gap: '$1',
                      px: '$2',
                      borderRight: '1px solid $gray-200',
                    },
                  }}
                >
                  {frameDimensions.map((frame) => (
                    <ToggleButton
                      pressed={
                        !hiddenSizes.some(
                          ([w, h]) => w === frame.width && h === frame.height
                        )
                      }
                      onPressedChange={(isPressed) => {
                        if (isPressed) {
                          setHiddenSizes(
                            hiddenSizes.filter(
                              (s) =>
                                !(
                                  s[0] === frame.width && s[1] === frame.height
                                ) && frameDimensions.includes(frame)
                            )
                          );
                        } else {
                          setHiddenSizes(
                            hiddenSizes.concat([[frame.width, frame.height]])
                          );
                        }
                      }}
                      key={frame.name}
                    >
                      {frame.name}
                    </ToggleButton>
                  ))}
                </Div>
              )}
              {(showPreview || isCommenting) && (
                <Div
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '$2',
                    px: '$2',
                  }}
                >
                  {!isCommenting && (
                    <>
                      <TextTooltip label="Measure">
                        <ToggleButton
                          pressed={isMeasuring}
                          onPressedChange={setIsMeasuring}
                          css={
                            isMeasuring
                              ? {
                                  backgroundColor: '$primary-700',
                                }
                              : undefined
                          }
                          data-testid="measure-toggle"
                        >
                          <MeasureIcon
                            active={isMeasuring}
                            width={20}
                            height={20}
                          />
                        </ToggleButton>
                      </TextTooltip>
                      <TextTooltip
                        label={
                          process.env.SYNC_STATE_TYPE === 'state'
                            ? 'Sync State'
                            : 'Sync Interactions'
                        }
                      >
                        <ToggleButton
                          pressed={syncState}
                          onPressedChange={setSyncState}
                          css={
                            syncState
                              ? {
                                  backgroundColor: '$primary-700',
                                }
                              : undefined
                          }
                          data-testid="sync-state-toggle"
                        >
                          <SyncIcon active={syncState} width={20} height={20} />
                        </ToggleButton>
                      </TextTooltip>
                    </>
                  )}
                  <TextTooltip label="Sync Scroll">
                    <ToggleButton
                      pressed={syncScroll}
                      onPressedChange={setSyncScroll}
                      css={
                        syncScroll
                          ? {
                              backgroundColor: '$primary-700',
                            }
                          : undefined
                      }
                      data-testid="sync-scroll-toggle"
                    >
                      <ScrollIcon active={syncScroll} />
                    </ToggleButton>
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
              {showMultipleScreens && showPreview && (
                <>
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <MenuButton>
                        <BtnText>{zoomLevel}% </BtnText>
                        <ZoomIcon width={20} height={20} />
                      </MenuButton>
                    </DropdownMenu.Trigger>
                    <RadioDropdown
                      value={zoomLevel}
                      onChangeValue={(level) =>
                        setZoomLevel(level, level === '75' ? undefined : level)
                      }
                      options={zoomOptions}
                      className={zoomDropdown()}
                    />
                  </DropdownMenu>
                  {showDeviceFrameSetting && (
                    <TextTooltip
                      label={
                        showDeviceFrame
                          ? 'Hide device frame'
                          : 'Show device frame'
                      }
                    >
                      <ToggleButton
                        pressed={showDeviceFrame}
                        onPressedChange={(pressed) =>
                          setShowDeviceFrame(
                            pressed,
                            pressed ? undefined : 'false'
                          )
                        }
                        css={
                          showDeviceFrame
                            ? {
                                backgroundColor: '$primary-700',
                              }
                            : undefined
                        }
                        data-testid="device-toggle"
                      >
                        <DeviceIcon active={showDeviceFrame} />
                      </ToggleButton>
                    </TextTooltip>
                  )}
                  {!isCommenting && (
                    <TextTooltip label="Wrap">
                      <ToggleButton
                        pressed={wrapPreview}
                        onPressedChange={setWrapPreview}
                        css={
                          wrapPreview
                            ? {
                                backgroundColor: '$primary-700',
                              }
                            : undefined
                        }
                        data-testid="wrap-preview-toggle"
                      >
                        <WrapIcon active={wrapPreview} />
                      </ToggleButton>
                    </TextTooltip>
                  )}
                </>
              )}
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
          <PropsEditorProvider serializeToParam>
            <Div
              className={className}
              css={{
                display: 'flex',
                backgroundColor: '$gray-200',
                ...(isDockToRight
                  ? {
                      flexDirection: 'row',
                      width: '100%',
                    }
                  : {
                      flex: 1,
                      flexDirection: 'column',
                    }),
              }}
              style={
                isDockToRight && toolbarSize
                  ? {
                      height: `calc(100vh - var(--header-height, 64px) - var(--breadcrumb-height, 0px) - ${toolbarSize.height}px)`,
                    }
                  : undefined
              }
            >
              <Div
                css={
                  isDockToRight
                    ? {
                        flex: 1,
                        overflow: 'auto',
                        overscrollBehavior: 'contain',
                      }
                    : undefined
                }
              >
                {(showPreview || isCommenting) &&
                  (showMultipleScreens ? (
                    <StandaloneCodeLiveEditorPreviewList
                      code={debouncedCode}
                      lang={props.lang}
                      codeHash={props.codeHash}
                      isCommenting={isCommenting}
                      isMeasuring={isMeasuring}
                      hiddenSizes={hiddenSizes}
                      fitHeight={
                        showDeviceFrame && (!showEditor || isCommenting)
                      }
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
                            css={{
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
                              <MarkerButton
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setActiveComment(comment.id);
                                }}
                                type="button"
                              >
                                <Marker
                                  iconClass={iconClass({
                                    active: isActive,
                                  })}
                                  data-active-comment={isActive ? true : null}
                                />
                              </MarkerButton>
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
                  ))}
                <ConsolePanel />
              </Div>
              {(isCommenting || isPropsEditor || showEditor) && (
                <Div
                  css={{
                    display: 'flex',
                    background: 'White',
                    ...(isDockToRight
                      ? isCommenting
                        ? {
                            minWidth: '23.5rem',
                          }
                        : {
                            width: '30rem',
                            borderLeft: '1px solid $gray-200',
                          }
                      : {}),
                  }}
                >
                  {!isCommenting && isPropsEditor && (
                    <Div css={{ flex: 1 }}>
                      <PropsEditorPanel />
                      <A11yPanel
                        activeTab={a11yTab}
                        setActiveTab={setA11yTab}
                        onHighlightItems={setHighlightedEls}
                        resetHiglights={resetHighlights}
                        scrollToFrameWhenSelect={isDockToRight}
                      />
                    </Div>
                  )}
                  {showEditor &&
                    !isCommenting &&
                    !isPropsEditor &&
                    (useAdvancedEditor ? (
                      isCodeParsed && (
                        <Div
                          css={{
                            flex: 1,
                            ...(isDockToRight
                              ? {
                                  display: 'flex',
                                  flexDirection: 'column',
                                }
                              : {}),
                          }}
                        >
                          <Div
                            css={{
                              flex: 1,
                              overflow: 'hidden',
                              height: isDockToRight
                                ? '100%'
                                : `${code.split(/\r\n|\r|\n/).length + 3}rem`,
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
                          <A11yPanel
                            activeTab={a11yTab}
                            setActiveTab={setA11yTab}
                            onHighlightItems={setHighlightedEls}
                            resetHiglights={resetHighlights}
                            scrollToFrameWhenSelect={isDockToRight}
                          />
                        </Div>
                      )
                    ) : (
                      <Div
                        css={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <CodeEditor
                          code={code}
                          onChange={setCode}
                          language={props.lang as Language}
                          theme={theme}
                          className={editor()}
                          wrapperClass={editorWrapper()}
                        />
                        <A11yPanel
                          activeTab={a11yTab}
                          setActiveTab={setA11yTab}
                          onHighlightItems={setHighlightedEls}
                          resetHiglights={resetHighlights}
                          scrollToFrameWhenSelect={isDockToRight}
                        />
                      </Div>
                    ))}
                  {isCommenting && (
                    <Div
                      css={{
                        height: isDockToRight ? '100%' : 200,
                        width: '100%',
                        backgroundColor: '$gray-100',
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
                        <NoCommentMsg>
                          No comment added.
                          <br />
                          Click on any point of the preview
                          <br /> to start adding comment.
                        </NoCommentMsg>
                      )}
                    </Div>
                  )}
                  <Div
                    css={{
                      display: 'none',
                      '@sm': {
                        display: 'flex',
                        flexFlow: 'column',
                        padding: '$2',
                        borderLeft: '1px solid $gray-200',
                      },
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
                      >
                        {isDockToRight ? (
                          <EditorRightIcon />
                        ) : (
                          <EditorBottomIcon />
                        )}
                      </IconButton>
                    </TextTooltip>
                  </Div>
                </Div>
              )}
            </Div>
          </PropsEditorProvider>
        </Div>
      </A11yResultByFrameContextProvider>
    </PreviewConsoleProvider>
  );
};

const NoCommentMsg = styled('p', {
  margin: '$1',
  padding: '$2',
  color: '$gray-500',
  textAlign: 'center',
});

const A11yPanel = (props: A11yResultPanelForFramesProps) => (
  <A11yPanelRoot>
    <A11yPanelTitle>Accessibility</A11yPanelTitle>
    <A11yResultPanelForFrames {...props} />
  </A11yPanelRoot>
);

const A11yPanelRoot = styled('section', {
  px: '$2',
  paddingBottom: '$3',
  minHeight: 200,
});

const A11yPanelTitle = styled('div', {
  fontSize: '$lg',
  lineHeight: '$lg',
  fontWeight: '500',
  px: '$2',
  paddingBottom: '$1',
  paddingTop: '$2',
  borderTop: '1px solid $gray-200',
});

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

const MarkerInner = styled(LocationMarkerIcon, {
  width: 20,
  height: 20,
  color: '$gray-500',
});

interface MarkerSpanProps extends React.ComponentPropsWithoutRef<'span'> {
  iconClass?: string;
}

const MarkerSpan = React.forwardRef<HTMLSpanElement, MarkerSpanProps>(
  function MarkerSpan({ iconClass, ...props }, forwardedRef) {
    return (
      <span {...props} ref={forwardedRef}>
        <MarkerInner width={20} height={20} className={iconClass} />
      </span>
    );
  }
);

const Marker = styled(MarkerSpan, {
  display: 'inline-block',
  width: 20,
  height: 20,
});

const MarkerButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '-10px',
  width: 40,
  height: 40,
});

const Toolbar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: '$3',
  backgroundColor: 'White',
  borderBottom: '1px solid $gray-200',
  '@lg': {
    position: 'sticky',
    zIndex: 10,
  },
});

const CommentIcon = styled(AnnotationIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const CommentOnIcon = styled(FilledAnnotationIcon, {
  width: 20,
  height: 20,
  color: 'White',
});

const SyncIcon = styled(RefreshIcon, {
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

const MeasureIcon = styled(TemplateIcon, {
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

const ScrollIcon = styled(SwitchVerticalIcon, {
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

const WrapIcon = styled(ReplyIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
  transform: 'scaleY(-1)',
  variants: {
    active: {
      true: {
        color: 'White',
      },
    },
  },
});

const DeviceIcon = styled(DeviceMobileIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
  transform: 'scaleY(-1)',
  variants: {
    active: {
      true: {
        color: 'White',
      },
    },
  },
});

const ZoomIcon = styled(ZoomInIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const ScreensIcon = styled(AdjustmentsIcon, {
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
  overflow: 'hidden',
});

const editor = css({
  borderRadius: '$base',
  height: '100%',
  overflowY: 'auto',
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
