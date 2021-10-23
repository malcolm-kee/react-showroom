import {
  AdjustmentsIcon,
  AnnotationIcon,
  CodeIcon,
  DesktopComputerIcon,
  ZoomInIcon,
} from '@heroicons/react/outline';
import {
  AnnotationIcon as FilledAnnotationIcon,
  LocationMarkerIcon,
} from '@heroicons/react/solid';
import { SupportedLanguage } from '@showroomjs/core';
import {
  css,
  DropdownMenu,
  styled,
  ToggleButton,
  useDebounce,
  usePersistedState,
  useQueryParams,
} from '@showroomjs/ui';
import lzString from 'lz-string';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { EXAMPLE_WIDTHS } from '../lib/config';
import { Div } from './base';
import { CheckboxDropdown } from './checkbox-dropdown';
import { CodeEditor } from './code-editor';
import { CodePreviewIframe } from './code-preview-iframe';
import { RadioDropdown } from './radio-dropdown';
import {
  BtnText,
  StandaloneCodeLiveEditorCopyButton,
} from './standalone-code-live-editor-copy-button';
import { StandaloneCodeLiveEditorPreviewList } from './standalone-code-live-editor-preview';

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

  const [code, setCode] = React.useState(props.code);
  const [showEditor, _setShowEditor] = React.useState(true);
  const setShowEditor = (show: boolean) => {
    _setShowEditor(show);
    setQueryParams({
      hideEditor: show ? undefined : 'true',
    });
  };
  const [showPreview, _setShowPreview] = React.useState(true);
  const setShowPreview = (show: boolean) => {
    _setShowPreview(show);
    setQueryParams({
      hidePreview: show ? undefined : 'true',
    });
  };
  const [zoomLevel, _setZoomLevel] = React.useState('100');
  const setZoomLevel = (level: string) => {
    _setZoomLevel(level);
    setQueryParams({
      zoom: level === '100' ? undefined : level,
    });
  };

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
      if (queryParams.zoom) {
        setZoomLevel(queryParams.zoom);
      }
      if (queryParams.hideEditor) {
        _setShowEditor(false);
      }
      if (queryParams.hidePreview) {
        _setShowPreview(false);
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
    }
  }, [isReady]);

  const debouncedCode = useDebounce(code);

  React.useEffect(() => {
    setQueryParams({
      code:
        debouncedCode === props.code ? undefined : safeCompress(debouncedCode),
    });
  }, [debouncedCode]);

  const [isCommenting, setIsCommenting] = React.useState(false);
  const previewListRef = React.useRef<HTMLUListElement>(null);
  const [targetCoord, setTargetCoord] = React.useState<Coord | undefined>(
    undefined
  );

  return (
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
          <Div
            css={{
              display: 'flex',
              gap: '$2',
              paddingRight: '$2',
              borderRight: '1px solid $gray-200',
            }}
          >
            <ToggleButton
              pressed={showEditor}
              onPressedChange={setShowEditor}
              aria-label="toggle editor"
            >
              <CodeIcon width={20} height={20} />
            </ToggleButton>
            <ToggleButton
              pressed={showPreview}
              onPressedChange={setShowPreview}
              disabled={isCommenting}
              aria-label="toggle preview"
            >
              <DesktopComputerIcon width={20} height={20} />
            </ToggleButton>
          </Div>
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
            <Div>
              <ToggleButton
                pressed={isCommenting}
                onPressedChange={setIsCommenting}
                css={{
                  '&[data-state=on]': {
                    backgroundColor: '$primary-700',
                  },
                }}
              >
                {isCommenting ? <CommentOnIcon /> : <CommentIcon />}
              </ToggleButton>
            </Div>
          )}
        </Div>
        <Div
          css={{
            display: 'inline-flex',
            gap: '$3',
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
                onChangeValue={setZoomLevel}
                options={[
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
                ]}
                className={zoomDropdown()}
              />
            </DropdownMenu>
          )}
          <StandaloneCodeLiveEditorCopyButton />
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
                if (previewListRef.current) {
                  const listRect =
                    previewListRef.current.getBoundingClientRect();
                  const listX = listRect.left + window.pageXOffset;
                  const listY = listRect.top + window.pageYOffset;
                  const elementRelative = {
                    x: coord.x - listX,
                    y: coord.y - listY,
                  };

                  setTargetCoord(elementRelative);
                }
              }}
              ref={previewListRef}
            >
              {targetCoord ? (
                <Marker
                  width={20}
                  height={20}
                  css={{
                    position: 'absolute',
                    top: targetCoord.y,
                    left: targetCoord.x,
                  }}
                />
              ) : null}
            </StandaloneCodeLiveEditorPreviewList>
          ) : (
            <CodePreviewIframe
              code={debouncedCode}
              lang={props.lang}
              codeHash={props.codeHash}
            />
          ))}
        {showEditor && !isCommenting && (
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
        )}
        {isCommenting && (
          <Div
            css={{
              height: 200,
            }}
          ></Div>
        )}
      </Div>
    </Div>
  );
};

const showMultipleScreens = EXAMPLE_WIDTHS.length > 0;

const zoomDropdown = css({
  minWidth: '80px !important',
});

const Marker = styled(LocationMarkerIcon, {
  width: 20,
  height: 20,
  color: '$gray-500',
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

interface Coord {
  x: number;
  y: number;
}

const safeCompress = (oriString: string): string => {
  try {
    return lzString.compressToEncodedURIComponent(oriString);
  } catch (err) {
    return oriString;
  }
};

const safeDecompress = (compressedString: string, fallback: string): string => {
  try {
    const decompressed =
      lzString.decompressFromEncodedURIComponent(compressedString);

    return decompressed === null ? fallback : decompressed;
  } catch (err) {
    return fallback;
  }
};
