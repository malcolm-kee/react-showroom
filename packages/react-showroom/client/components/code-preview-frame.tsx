import { CommandLineIcon } from '@heroicons/react/20/solid';
import { SupportedLanguage } from '@showroomjs/core';
import { Alert, iconClass, tw } from '@showroomjs/ui';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStableCallback } from '../lib/callback';
import { useCodeCompilation } from '../lib/use-code-compilation';
import { CodePreview } from './code-preview';
import { ErrorFallback } from './error-fallback';

export interface CodePreviewFrameProps
  extends React.ComponentPropsWithoutRef<'div'> {
  code: string;
  lang: SupportedLanguage;
  nonVisual?: boolean;
  onIsCompilingChange?: (isCompiling: boolean) => void;
}

export const CodePreviewFrame = React.forwardRef<
  HTMLDivElement,
  CodePreviewFrameProps
>(function CodePreviewFrame(
  { code, lang, nonVisual, onIsCompilingChange, ...divProps },
  forwardedRef
) {
  const errorBoundaryRef = React.useRef<ErrorBoundary>(null);

  const { data, isCompiling, error, isError } = useCodeCompilation(code, lang);

  const onIsCompilingChangeCb = useStableCallback(onIsCompilingChange);
  React.useEffect(() => {
    onIsCompilingChangeCb(isCompiling);
  }, [isCompiling]);

  React.useEffect(() => {
    if (errorBoundaryRef.current) {
      errorBoundaryRef.current.reset();
    }
  }, [code]);

  return (
    <div
      {...divProps}
      className={tw(
        ['relative bg-white', nonVisual ? 'p-0 min-h-0' : 'p-1 min-h-[30px]'],
        [divProps.className]
      )}
      ref={forwardedRef}
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
            <CodePreview
              {...data}
              skipConsoleForInitialRender={lang === 'html'}
            />
          </ErrorBoundary>
        ) : (
          <Alert variant="error">{formatError(data.error)}</Alert>
        ))
      )}
      {isCompiling && !nonVisual && (
        <div
          className={tw([
            'flex items-center justify-center gap-2 absolute inset-y-0 right-0 px-4 bg-zinc-300/10',
          ])}
        >
          <CommandLineIcon width="20" height="20" className={iconClass} />
          <span className={tw(['text-zinc-500'])}>Compiling...</span>
        </div>
      )}
    </div>
  );
});

const formatError = (error: string) => error.replace(/<stdin>:|"\\x0A"/g, '');
