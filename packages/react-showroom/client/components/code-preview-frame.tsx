import { TerminalIcon } from '@heroicons/react/outline';
import { SupportedLanguage } from '@showroomjs/core';
import { Alert, icons } from '@showroomjs/ui';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStableCallback } from '../lib/callback';
import { useCodeCompilation } from '../lib/use-code-compilation';
import { Div, Span } from './base';
import { CodePreview } from './code-preview';
import { ErrorFallback } from './error-fallback';

export interface CodePreviewFrameProps {
  code: string;
  lang: SupportedLanguage;
  nonVisual?: boolean;
  onIsCompilingChange?: (isCompiling: boolean) => void;
}

export const CodePreviewFrame = (props: CodePreviewFrameProps) => {
  const errorBoundaryRef = React.useRef<ErrorBoundary>(null);

  const { data, isCompiling, error, isError } = useCodeCompilation(
    props.code,
    props.lang
  );

  const onIsCompilingChangeCb = useStableCallback(props.onIsCompilingChange);
  React.useEffect(() => {
    onIsCompilingChangeCb(isCompiling);
  }, [isCompiling]);

  React.useEffect(() => {
    if (errorBoundaryRef.current) {
      errorBoundaryRef.current.reset();
    }
  }, [props.code]);

  return (
    <Div
      css={{
        position: 'relative',
        padding: props.nonVisual ? 0 : '$1',
        minHeight: props.nonVisual ? 0 : 30,
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
      {isCompiling && !props.nonVisual && (
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
  );
};

const formatError = (error: string) => error.replace(/<stdin>:|\"\\x0A\"/g, '');
