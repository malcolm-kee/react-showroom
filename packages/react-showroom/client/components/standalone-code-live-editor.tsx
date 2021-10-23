import {
  DotsVerticalIcon,
  ShareIcon,
  ZoomInIcon,
} from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { SupportedLanguage } from '@showroomjs/core';
import {
  CopyButton,
  css,
  DropdownMenu,
  styled,
  ToggleButton,
  useDebounce,
  useNotification,
  usePersistedState,
  useQueryParams,
} from '@showroomjs/ui';
import lzString from 'lz-string';
import type { Language } from 'prism-react-renderer';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { EXAMPLE_WIDTHS } from '../lib/config';
import { Div } from './base';
import { CheckboxDropdown } from './checkbox-dropdown';
import { CodeEditor } from './code-editor';
import { CodePreviewIframe } from './code-preview-iframe';
import { RadioDropdown } from './radio-dropdown';

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
  const showMsg = useNotification();

  const [code, setCode] = React.useState(props.code);
  const [editorView, setEditorView] = React.useState<EditorView>('both');
  const [zoomLevel, _setZoomLevel] = React.useState('100');
  const setZoomLevel = (level: string) => {
    _setZoomLevel(level);
    setQueryParams({
      zoom: level === '100' ? undefined : level,
    });
  };
  const onEditorViewChange = (view: EditorView) => {
    setEditorView(view);
    setQueryParams({
      editorView: view !== 'both' ? view : undefined,
    });
  };

  React.useEffect(() => {
    if (isReady) {
      if (queryParams.code) {
        setCode(safeDecompress(queryParams.code as string, props.code));
      }
      if (queryParams.editorView) {
        setEditorView(queryParams.editorView as EditorView);
      }
      if (queryParams.zoom) {
        setZoomLevel(queryParams.zoom);
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

  const [hiddenSizes, setHiddenSizes] = usePersistedState<Array<number>>(
    [],
    'hiddenScreen'
  );

  const showPreview = editorView !== 'editorOnly';

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
            gap: '$2',
          }}
        >
          <EditorViewDropdown
            value={editorView}
            onChange={onEditorViewChange}
          />
          <Div
            css={{
              display: 'block',
              '@sm': {
                display: 'none',
              },
            }}
          >
            {showMultipleScreens && showPreview && (
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <MenuButton>
                    Screens <DotsVerticalIcon width={16} height={16} />
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
                  {zoomLevel}% <ZoomIcon width={20} height={20} />
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
          <CopyButton
            getTextToCopy={() => {
              if (window) {
                return window.location.href;
              }
              return '';
            }}
            className={btn()}
            onCopy={() => showMsg('URL copied')}
            label={
              <>
                <span>Share</span>
                <StyledShareIcon width={20} height={20} />
              </>
            }
            successLabel={
              <>
                <CopiedMessage>Share</CopiedMessage>
                <MiniCheckIcon width={20} height={20} />
              </>
            }
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
            <PreviewList
              code={debouncedCode}
              lang={props.lang}
              codeHash={props.codeHash}
              hiddenSizes={hiddenSizes}
              previewOnly={editorView === 'previewOnly'}
              zoom={zoomLevel}
            />
          ) : (
            <CodePreviewIframe
              code={debouncedCode}
              lang={props.lang}
              codeHash={props.codeHash}
            />
          ))}
        {editorView !== 'previewOnly' && (
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
      </Div>
    </Div>
  );
};

const EditorViewDropdown = (props: {
  value: EditorView;
  onChange: (view: EditorView) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <MenuButton>
          Sections <DotsVerticalIcon width={16} height={16} />
        </MenuButton>
      </DropdownMenu.Trigger>
      <RadioDropdown
        value={props.value}
        onChangeValue={props.onChange}
        options={[
          {
            value: 'both',
            label: 'Editor + Preview',
          },
          {
            value: 'editorOnly',
            label: 'Editor only',
          },
          {
            value: 'previewOnly',
            label: 'Preview only',
          },
        ]}
      />
    </DropdownMenu>
  );
};

const PreviewList = (props: {
  code: string;
  lang: SupportedLanguage;
  codeHash: string;
  hiddenSizes: Array<number>;
  previewOnly: boolean;
  zoom: string;
}) => {
  const zoomValue = React.useMemo(() => Number(props.zoom), [props.zoom]);
  const shouldAdjustZoom = !isNaN(zoomValue) && zoomValue !== 100;

  const content = EXAMPLE_WIDTHS.map((width) =>
    props.hiddenSizes.includes(width) ? null : (
      <ScreenWrapper key={width}>
        <Screen
          css={{
            width: `${
              shouldAdjustZoom ? Math.round((width * zoomValue) / 100) : width
            }px`,
          }}
        >
          <CodePreviewIframe
            code={props.code}
            lang={props.lang}
            codeHash={props.codeHash}
            css={{
              width: `${width}px`,
              ...(shouldAdjustZoom
                ? {
                    transform: `scale(${zoomValue / 100})`,
                    transformOrigin: 'top left',
                  }
                : {}),
            }}
          />
        </Screen>
        <ScreenSize>{width}px</ScreenSize>
      </ScreenWrapper>
    )
  );

  return props.previewOnly ? (
    <ScreenList className={resizeStyle()}>{content}</ScreenList>
  ) : (
    <Resizable enable={resizeEnable} as="ul" className={resizeStyle()}>
      {content}
    </Resizable>
  );
};

type EditorView = 'both' | 'previewOnly' | 'editorOnly';

const showMultipleScreens = EXAMPLE_WIDTHS.length > 0;

const resizeEnable: ResizeEnable = {
  top: false,
  right: false,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

const zoomDropdown = css({
  minWidth: '80px !important',
});

const ScreenList = styled('ul', {
  flex: 1,
});

const resizeStyle = css({
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  gap: '$3',
  paddingTop: '$3',
  paddingBottom: '$6',
  px: '$3',
  backgroundColor: '$gray-200',
});

const ScreenSize = styled('div', {
  px: '$2',
  py: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$gray-500',
});

const Screen = styled('div', {
  shadow: 'sm',
  backgroundColor: 'White',
  transition: 'box-shadow 100ms ease-in-out',
  height: '100%',
  overflow: 'hidden',
});

const ScreenWrapper = styled('li', {
  [`&:hover ${ScreenSize}`]: {
    color: 'Black',
    fontWeight: '500',
  },
  [`&:hover ${Screen}`]: {
    shadow: 'lg',
  },
});

const ZoomIcon = styled(ZoomInIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const StyledShareIcon = styled(ShareIcon, {
  width: 20,
  height: 20,
  color: '$gray-400',
});

const MiniCheckIcon = styled(CheckCircleIcon, {
  width: 20,
  height: 20,
  color: '$green-400',
});

const CopiedMessage = styled('span', {
  color: '$green-800',
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

const btn = css({
  minWidth: 36,
  height: 36,
  px: 6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  position: 'relative',
});

const editor = css({
  borderRadius: '$base',
  height: '100%',
  overflowY: 'auto',
});

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
