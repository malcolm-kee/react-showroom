import {
  DotsVerticalIcon,
  TerminalIcon,
  ShareIcon,
} from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { SupportedLanguage } from '@showroomjs/core';
import {
  Alert,
  CopyButton,
  css,
  DropdownMenu,
  icons,
  styled,
  useDebounce,
  useQueryParams,
} from '@showroomjs/ui';
import lzString from 'lz-string';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeCompilation } from '../lib/use-code-compilation';
import { Div, Span } from './base';
import { CodeEditor } from './code-editor';
import { CodePreview } from './code-preview';
import { RadioDropdown } from './radio-dropdown';

export interface StandaloneCodeLiveEditorProps {
  code: string;
  lang: SupportedLanguage;
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

  const errorBoundaryRef = React.useRef<ErrorBoundary>(null);

  const { data, error, isError, isCompiling } = useCodeCompilation(
    debouncedCode,
    props.lang,
    {
      onSuccess: () => {
        if (errorBoundaryRef.current) {
          errorBoundaryRef.current.reset();
        }
      },
    }
  );

  return (
    <>
      <Div
        css={{
          textAlign: 'right',
          px: '$3',
          paddingTop: '$2',
        }}
      >
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
                Views <DotsVerticalIcon width={16} height={16} />
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
          padding: '$2',
          '@xl': {
            display: 'flex',
            flexDirection: 'row-reverse',
            gap: '$4',
          },
        }}
      >
        {editorView !== 'editorOnly' && (
          <Div
            css={{
              flex: 1,
              position: 'relative',
              minHeight: 48,
              border: '1px solid',
              borderColor: '$gray-300',
              padding: '$1',
            }}
          >
            {isError ? (
              <Alert variant="error">
                {typeof error === 'string' ? error : 'Compilation error'}
              </Alert>
            ) : (
              data &&
              (data.type === 'success' ? (
                <ErrorBoundary
                  FallbackComponent={ErrorFallback}
                  ref={errorBoundaryRef}
                >
                  <CodePreview {...data} />
                </ErrorBoundary>
              ) : (
                <Alert variant="error">{formatError(data.error)}</Alert>
              ))
            )}
            {isCompiling && (
              <Div
                css={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  px: '$4',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(229, 231, 235, 0.1)',
                  gap: '$2',
                  '@xl': {
                    top: '50%',
                    left: '50%',
                    bottom: 'auto',
                    right: 'auto',
                    transform: 'translate(-50%, -50%)',
                  },
                }}
              >
                <TerminalIcon width="20" height="20" className={icons()} />
                <Span
                  css={{
                    color: '$gray-500',
                  }}
                >
                  Compiling...
                </Span>
              </Div>
            )}
          </Div>
        )}

        {editorView !== 'previewOnly' && (
          <Div
            css={{
              '@xl': {
                flex: 1,
              },
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
          </Div>
        )}
      </Div>
    </>
  );
};

type EditorView = 'both' | 'previewOnly' | 'editorOnly';

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
  '@xl': {
    height: '100%',
    overflowY: 'auto',
  },
});

const ErrorFallback = (props: FallbackProps) => {
  return (
    <Alert variant="error">
      {props.error instanceof Error
        ? props.error.message
        : JSON.stringify(props.error)}
    </Alert>
  );
};

const formatError = (error: string) => error.replace(/<stdin>:|\"\\x0A\"/g, '');

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
