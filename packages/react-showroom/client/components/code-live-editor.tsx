import { ArrowsExpandIcon, TerminalIcon } from '@heroicons/react/outline';
import { Alert, Collapsible, css, Dialog, icons, styled } from '@showroomjs/ui';
import lzString from 'lz-string';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ComponentDataContext } from '../lib/component-data-context';
import { useDialog } from '../lib/dialog-context';
import { useCodeCompilation } from '../lib/use-code-compilation';
import { useDebounce } from '../lib/use-debounce';
import { useQueryParams } from '../lib/use-query-params';
import { Div, Span } from './base';
import { CodeEditor, CodeEditorProps } from './code-editor';
import { CodePreview } from './code-preview';

export interface CodeLiveEditorProps
  extends Pick<CodeEditorProps, 'language' | 'theme'> {
  code: string;
  hasDialog?: boolean;
  hasHeading?: boolean;
  id?: string;
  className?: string;
  shouldEncodeInUrl?: boolean;
}

export const CodeLiveEditor = ({
  hasDialog,
  hasHeading,
  className,
  shouldEncodeInUrl,
  ...props
}: CodeLiveEditorProps) => {
  const [queryParams, setQueryParams] = useQueryParams();

  const [code, setCode] = React.useState(() => {
    return shouldEncodeInUrl && queryParams.code
      ? safeDecompress(queryParams.code as string, props.code)
      : props.code;
  });

  const debouncedCode = useDebounce(code);

  const errorBoundaryRef = React.useRef<ErrorBoundary>(null);

  const { data, isFetching, isLoading, error, isError } = useCodeCompilation(
    debouncedCode,
    {
      onSuccess: () => {
        if (errorBoundaryRef.current) {
          errorBoundaryRef.current.reset();
        }
      },
    }
  );

  const isCompiling = isFetching || isLoading;

  const [showCode, setShowCode] = React.useState<boolean | undefined>(
    !hasDialog
  );

  return (
    <div className={className}>
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
          {hasDialog && <CodeLiveEditorFocus {...props} />}
        </Div>
        <Collapsible.Content>
          <CodeEditor
            code={code}
            onChange={(newCode) => {
              setCode(newCode);
              if (shouldEncodeInUrl) {
                setQueryParams({
                  code:
                    newCode === props.code ? undefined : safeCompress(newCode),
                });
              }
            }}
            language={props.language}
            className={editorBottom()}
            theme={props.theme}
          />
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
};

const CodeLiveEditorFocus = (props: Omit<CodeLiveEditorProps, 'hasDialog'>) => {
  const dialog = useDialog(props.id);

  const componentData = React.useContext(ComponentDataContext);

  return (
    <Dialog
      open={dialog.isOpen}
      onOpenChange={(opening) => (opening ? dialog.open() : dialog.dismiss())}
    >
      <Dialog.Trigger asChild>
        <Button type="button">
          Standalone
          <ArrowsExpandIcon width={20} height={20} className={icons()} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content fullWidth>
        {componentData && (
          <Dialog.Title>{componentData.component.displayName}</Dialog.Title>
        )}
        <Div
          css={{
            padding: '$2',
          }}
        >
          {dialog.isOpen && <CodeLiveEditor {...props} shouldEncodeInUrl />}
        </Div>
      </Dialog.Content>
    </Dialog>
  );
};

const Button = styled('button', {
  display: 'inline-flex',
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
