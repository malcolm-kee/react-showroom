import {
  AdjustmentsIcon,
  AnnotationIcon,
  CodeIcon,
  DesktopComputerIcon,
  RefreshIcon,
  TerminalIcon,
  ZoomInIcon,
} from '@heroicons/react/outline';
import {
  AnnotationIcon as FilledAnnotationIcon,
  LocationMarkerIcon,
} from '@heroicons/react/solid';
import {
  CompileResult,
  isEqualArray,
  SupportedLanguage,
} from '@showroomjs/core';
import {
  css,
  DropdownMenu,
  styled,
  ToggleButton,
  Tooltip,
  useDebounce,
  usePersistedState,
  useQueryParams,
} from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { safeCompress, safeDecompress } from '../lib/compress';
import { EXAMPLE_WIDTHS } from '../lib/config';
import { lazy, Suspense } from '../lib/lazy';
import { getScrollFn } from '../lib/scroll-into-view';
import { useCodeCompilationCache } from '../lib/use-code-compilation';
import { useCommentState } from '../lib/use-comment-state';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { useStateWithParams } from '../lib/use-state-with-params';
import { useTargetAudience } from '../lib/use-target-audience';
import { Div } from './base';
import { CheckboxDropdown } from './checkbox-dropdown';
import { CodeEditor } from './code-editor';
import { CodePreviewIframe } from './code-preview-iframe';
import { ConsolePanel } from './console-panel';
import { RadioDropdown } from './radio-dropdown';
import { CommentList } from './standalone-code-live-editor-comment';
import { StandaloneCodeLiveEditorCommentPopover } from './standalone-code-live-editor-comment-popover';
import {
  BtnText,
  StandaloneCodeLiveEditorCopyButton,
} from './standalone-code-live-editor-copy-button';
import { StandaloneCodeLiveEditorPreviewList } from './standalone-code-live-editor-preview';

const CodeAdvancedEditor = lazy(() =>
  import('./code-advanced-editor').then((m) => ({
    default: m.CodeAdvancedEditor,
  }))
);

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

  const { state: commentState, add, remove } = useCommentState(props.codeHash);
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
  const [zoomLevel, setZoomLevel] = useStateWithParams('100', 'zoom', (x) => x);

  const [hiddenSizes, _setHiddenSizes] = usePersistedState<Array<number>>(
    [],
    'hiddenScreen'
  );
  const setHiddenSizes = (sizes: Array<number>) => {
    _setHiddenSizes(sizes);
    setQueryParams({
      hiddenSizes: sizes.length === 0 ? undefined : sizes.join('_'),
    });
  };

  React.useEffect(() => {
    if (isReady) {
      if (queryParams.code) {
        setCode(safeDecompress(queryParams.code as string, props.code));
      }
      if (queryParams.hiddenSizes) {
        const serializedHiddenSizes = queryParams.hiddenSizes
          .split('_')
          .map(Number)
          .filter((v) => !isNaN(v) && EXAMPLE_WIDTHS.includes(v));

        if (serializedHiddenSizes.length > 0) {
          _setHiddenSizes(serializedHiddenSizes);
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
          isEqualArray(item.hiddenSizes, hiddenSizes, { ignoreOrder: true })
      ),
    [commentState.items, zoomLevel, hiddenSizes]
  );

  const targetAudience = useTargetAudience();
  const [syncState, setSyncState] = usePersistedState(
    targetAudience === 'developer',
    'syncState'
  );

  const [useAdvancedEditor, setUseAdvancedEditor] = usePersistedState(
    false,
    'useAdvancedEditor'
  );

  const initialCompilation = useCodeCompilationCache(props.code, props.lang);

  return (
    <PreviewConsoleProvider>
      <Div css={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: '$3',
          }}
        >
          <Div
            css={{
              display: 'flex',
            }}
          >
            {!isCommenting && (
              <Div
                css={{
                  display: 'flex',
                  gap: '$2',
                  paddingRight: '$2',
                  borderRight: '1px solid $gray-200',
                }}
              >
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
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
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    Editor
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Root>
                {process.env.ENABLE_ADVANCED_EDITOR
                  ? showEditor && (
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
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
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          Advanced Editor
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    )
                  : null}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
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
                      <DesktopComputerIcon width={20} height={20} />
                    </ToggleButton>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    Preview
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Root>
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
              {showMultipleScreens && showPreview && (
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <MenuButton>
                      <ScreensIcon width={20} height={20} />
                    </MenuButton>
                  </DropdownMenu.Trigger>
                  <CheckboxDropdown>
                    {EXAMPLE_WIDTHS.map((width) => (
                      <CheckboxDropdown.Item
                        checked={!hiddenSizes.includes(width)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setHiddenSizes(
                              hiddenSizes.filter(
                                (s) =>
                                  s !== width && EXAMPLE_WIDTHS.includes(width)
                              )
                            );
                          } else {
                            setHiddenSizes(hiddenSizes.concat(width));
                          }
                        }}
                        key={width}
                      >
                        {width}px
                      </CheckboxDropdown.Item>
                    ))}
                  </CheckboxDropdown>
                </DropdownMenu>
              )}
            </Div>
            <Div
              css={{
                display: 'none',
                '@sm': {
                  display: 'flex',
                  gap: '$1',
                  px: '$2',
                },
              }}
            >
              {showMultipleScreens &&
                showPreview &&
                EXAMPLE_WIDTHS.map((width) => (
                  <ToggleButton
                    pressed={!hiddenSizes.includes(width)}
                    onPressedChange={(isPressed) => {
                      if (isPressed) {
                        setHiddenSizes(
                          hiddenSizes.filter(
                            (s) => s !== width && EXAMPLE_WIDTHS.includes(width)
                          )
                        );
                      } else {
                        setHiddenSizes(hiddenSizes.concat(width));
                      }
                    }}
                    key={width}
                  >
                    {width}
                  </ToggleButton>
                ))}
            </Div>
            {showPreview && (
              <Div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '$2',
                }}
              >
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <ToggleButton
                      pressed={isCommenting}
                      onPressedChange={(isCommentMode) =>
                        setIsCommenting(
                          isCommentMode,
                          isCommentMode ? 'true' : undefined
                        )
                      }
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
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    Comment
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Root>
                {!isCommenting && (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
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
                        <SyncIcon active={syncState} />
                      </ToggleButton>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      Sync State
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Root>
                )}
              </Div>
            )}
          </Div>
          <Div
            css={{
              display: 'inline-flex',
              gap: '$1',
            }}
          >
            {showMultipleScreens && showPreview && (
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
                    setZoomLevel(level, level === '100' ? undefined : level)
                  }
                  options={zoomOptions}
                  className={zoomDropdown()}
                />
              </DropdownMenu>
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
        </Div>
        <Div
          className={className}
          css={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {showPreview &&
            (showMultipleScreens ? (
              <StandaloneCodeLiveEditorPreviewList
                code={debouncedCode}
                lang={props.lang}
                codeHash={props.codeHash}
                isCommenting={isCommenting}
                hiddenSizes={hiddenSizes}
                fitHeight={!showEditor || isCommenting}
                zoom={zoomLevel}
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
                        hiddenSizes,
                        left: targetCoord.x,
                        top: targetCoord.y,
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
          {showEditor &&
            !isCommenting &&
            (useAdvancedEditor ? (
              isCodeParsed && (
                <Div css={{ flex: 1 }}>
                  <AdvancedEditor
                    value={code}
                    onChange={setCode}
                    language={props.lang as Language}
                    initialResult={initialCompilation.data}
                  />
                </Div>
              )
            ) : (
              <Div css={{ flex: 1 }}>
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={props.lang as Language}
                  theme={theme}
                  className={editor()}
                  wrapperClass={editorWrapper()}
                />
              </Div>
            ))}
          {isCommenting && (
            <Div
              css={{
                height: 200,
                backgroundColor: '$gray-100',
              }}
            >
              {commentState.items.length > 0 && (
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
                        setActiveComment(comment.id);
                      }}
                      onDismiss={() => remove(comment.id)}
                      key={comment.id}
                    >
                      {comment.text}
                    </CommentList.Item>
                  ))}
                </CommentList>
              )}
            </Div>
          )}
        </Div>
      </Div>
    </PreviewConsoleProvider>
  );
};

const AdvancedEditor = (props: {
  value: string;
  onChange: (code: string) => void;
  language: Language;
  initialResult: CompileResult | undefined;
}) => {
  if (process.env.ENABLE_ADVANCED_EDITOR) {
    return (
      <Suspense fallback={null}>
        <CodeAdvancedEditor {...props} />
      </Suspense>
    );
  }

  return null;
};

const zoomOptions = [
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

const showMultipleScreens = EXAMPLE_WIDTHS.length > 0;

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
  height: '100%',
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
