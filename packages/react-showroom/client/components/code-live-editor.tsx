import { ArrowsExpandIcon, TerminalIcon } from '@heroicons/react/outline';
import { removeTrailingSlash, SupportedLanguage } from '@showroomjs/core';
import {
  Alert,
  Collapsible,
  css,
  icons,
  styled,
  useDebounce,
} from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { Link, useRouteMatch } from '../lib/routing';
import { useCodeCompilation } from '../lib/use-code-compilation';
import { Div, Span } from './base';
import { BrowserWindow } from './browser-window';
import { CodeEditor } from './code-editor';
import { CodePreview } from './code-preview';

export interface CodeLiveEditorProps {
  code: string;
  lang: SupportedLanguage;
  hasHeading?: boolean;
  id?: string;
  className?: string;
  noEditor?: boolean;
}

export const CodeLiveEditor = ({
  hasHeading,
  className,
  noEditor,
  ...props
}: CodeLiveEditorProps) => {
  const theme = useCodeTheme();

  const [code, setCode] = React.useState(props.code);

  const debouncedCode = useDebounce(code);

  const errorBoundaryRef = React.useRef<ErrorBoundary>(null);

  const { data, isCompiling, error, isError } = useCodeCompilation(
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

  const [showCode, setShowCode] = React.useState<boolean | undefined>(false);

  const content = (
    <>
      <Div
        css={{
          position: 'relative',
          minHeight: 48,
          border: '1px solid',
          borderColor: '$gray-300',
          padding: '$1',
          roundedT: hasHeading ? '$none' : '$base',
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
      {!noEditor && (
        <Collapsible.Root open={showCode} onOpenChange={setShowCode}>
          <Div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              py: '$1',
            }}
          >
            <Collapsible.Button
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: '$1',
                fontSize: '$sm',
                lineHeight: '$sm',
              }}
            >
              <Collapsible.ToggleIcon
                hide={showCode}
                aria-label={showCode ? 'Hide' : 'View'}
                width="16"
                height="16"
              />
              Code
            </Collapsible.Button>
            <LinkToStandaloneView code={props.code} />
          </Div>
          <Collapsible.Content>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={props.lang as Language}
              className={editorBottom()}
              theme={theme}
            />
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  );

  return (
    <div className={className}>
      {noEditor ? (
        <BrowserWindow url="preview">{content}</BrowserWindow>
      ) : (
        content
      )}
    </div>
  );
};

const LinkToStandaloneView = (props: { code: string }) => {
  const { url } = useRouteMatch();

  const codeBlocks = useCodeBlocks();
  const matchCodeData = codeBlocks[props.code];

  return matchCodeData ? (
    <Button
      as={Link}
      to={`${removeTrailingSlash(url)}/_standalone/${
        matchCodeData.initialCodeHash
      }`}
    >
      Standalone
      <ArrowsExpandIcon width={20} height={20} className={icons()} />
    </Button>
  ) : null;
};

const Button = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  px: '$1',
  gap: '$1',
  fontSize: '$sm',
  color: '$gray-500',
  outlineRing: '',
});

const editorBottom = css({
  borderRadius: '$base',
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
