import { TerminalIcon } from '@heroicons/react/outline';
import { SupportedLanguage } from '@showroomjs/core';
import { Alert, css, icons, useDebounce, useQueryParams } from '@showroomjs/ui';
import lzString from 'lz-string';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeCompilation } from '../lib/use-code-compilation';
import { Div, Span } from './base';
import { CodeEditor } from './code-editor';
import { CodePreview } from './code-preview';

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

  React.useEffect(() => {
    if (isReady && queryParams.code) {
      setCode(safeDecompress(queryParams.code as string, props.code));
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
    <Div
      className={className}
      css={{
        padding: '$2',
        height: '100%',
        '@xl': {
          display: 'flex',
          flexDirection: 'row-reverse',
          gap: '$4',
        },
      }}
    >
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
    </Div>
  );
};

const editorWrapper = css({
  height: '100%',
  overflow: 'hidden',
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
