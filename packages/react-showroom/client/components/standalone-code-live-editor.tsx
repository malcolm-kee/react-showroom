import { DotsVerticalIcon, ShareIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { SupportedLanguage } from '@showroomjs/core';
import {
  CopyButton,
  css,
  DropdownMenu,
  styled,
  ToggleButton,
  useDebounce,
  useQueryParams,
  usePersistedState,
} from '@showroomjs/ui';
import lzString from 'lz-string';
import type { Language } from 'prism-react-renderer';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { EXAMPLE_WIDTHS } from '../lib/config';
import { Div } from './base';
import { CodeEditor } from './code-editor';
import { CodePreviewIframe } from './code-preview-iframe';
import { RadioDropdown } from './radio-dropdown';
import { CheckboxDropdown } from './checkbox-dropdown';

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
  const [editorView, setEditorView] = React.useState<EditorView>('both');

  React.useEffect(() => {
    if (isReady) {
      if (queryParams.code) {
        setCode(safeDecompress(queryParams.code as string, props.code));
      }
      if (queryParams.editorView) {
        setEditorView(queryParams.editorView as EditorView);
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
          py: '$2',
        }}
      >
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
                            (s) => s !== width && EXAMPLE_WIDTHS.includes(width)
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
        <Div
          css={{
            display: 'inline-flex',
            gap: '$3',
          }}
        >
          <CopyButton
            getTextToCopy={() => {
              if (window) {
                return window.location.href;
              }
              return '';
            }}
            className={btn()}
            label={<StyledShareIcon width={24} height={24} />}
            successLabel={
              <>
                <CopiedMessage>Copied to Clipboard</CopiedMessage>
                <StyledShareIcon
                  width={24}
                  height={24}
                  css={{
                    color: '$green-400',
                  }}
                />
                <MiniCheckIcon width={16} height={16} />
              </>
            }
          />
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <MenuButton>
                Sections <DotsVerticalIcon width={16} height={16} />
              </MenuButton>
            </DropdownMenu.Trigger>
            <RadioDropdown
              value={editorView}
              onChangeValue={(newView) => {
                setEditorView(newView);
                setQueryParams({
                  editorView: newView,
                });
              }}
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
        </Div>
      </Div>
      <Div
        className={className}
        css={{
          width: '100vw',
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

const PreviewList = (props: {
  code: string;
  lang: SupportedLanguage;
  codeHash: string;
  hiddenSizes: Array<number>;
  previewOnly: boolean;
}) => {
  const content = EXAMPLE_WIDTHS.map((width) =>
    props.hiddenSizes.includes(width) ? null : (
      <ScreenWrapper key={width}>
        <Screen>
          <CodePreviewIframe
            code={props.code}
            lang={props.lang}
            codeHash={props.codeHash}
            css={{
              width: `${width}px`,
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

const StyledShareIcon = styled(ShareIcon, {
  width: 24,
  height: 24,
  color: '$gray-400',
});

const MiniCheckIcon = styled(CheckCircleIcon, {
  color: '$green-400',
  width: 16,
  height: 16,
  position: 'absolute',
  top: 0,
  right: 0,
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
