import { ArrowsExpandIcon, TerminalIcon } from '@heroicons/react/outline';
import { SUPPORTED_LANGUAGES } from '@showroomjs/core';
import { Alert, Collapsible, css, Dialog, icons, styled } from '@showroomjs/ui';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useCodeTheme } from '../lib/code-theme-context';
import { ComponentDataContext } from '../lib/component-data-context';
import { useDialog } from '../lib/dialog-context';
import { useCodeCompilation } from '../lib/use-code-compilation';
import { Div, Span } from './base';
import { CodeEditor, CodeEditorProps } from './code-editor';
import { CodeHighlight } from './code-highlight';
import { CodePreview } from './code-preview';
import { LanguageTag } from './language-tag';

const IsBlockCodeContext = React.createContext(false);
IsBlockCodeContext.displayName = 'ShowroomIsBlockCodeContext';

export const Pre = (props: { children: React.ReactNode }) => (
  <Div
    css={{
      marginTop: '$4',
      marginBottom: '$8',
    }}
  >
    <IsBlockCodeContext.Provider value={true}>
      {props.children}
    </IsBlockCodeContext.Provider>
  </Div>
);

export const Code = (props: {
  children: React.ReactNode;
  className?: string;
  static?: boolean;
  id?: string;
  inlineBlock?: boolean;
  fileName?: string;
}) => {
  const isBlockCode = React.useContext(IsBlockCodeContext);

  if (!isBlockCode || typeof props.children !== 'string') {
    return <InlineCode {...props} />;
  }

  const lang: any = props.className && props.className.split('-').pop();
  const code = props.children.trim();

  const heading = props.fileName ? (
    <Div
      css={{
        px: '$2',
        py: '$1',
        backgroundColor: '$gray-300',
        roundedT: '$md',
        fontSize: '$sm',
        lineHeight: '$sm',
      }}
    >
      <code>{props.fileName}</code>
    </Div>
  ) : null;

  const theme = useCodeTheme();

  if (!SUPPORTED_LANGUAGES.includes(lang) || props.static) {
    return (
      <>
        {heading}
        <Div
          style={{
            ...(typeof theme.plain === 'object' ? (theme.plain as any) : {}),
          }}
          css={{
            py: 10,
            fontSize: 14,
            roundedT: heading ? '$none' : props.inlineBlock ? '$xl' : '$base',
            roundedB: props.inlineBlock ? '$xl' : '$base',
            whiteSpace: 'pre',
            fontFamily: 'monospace',
            position: 'relative',
            display: props.inlineBlock ? 'inline-block' : 'block',
            px: props.inlineBlock ? '$6' : 10,
          }}
          className={props.className}
        >
          <CodeHighlight code={code} language={lang} theme={theme} />
          {!props.inlineBlock && lang && <LanguageTag language={lang} />}
        </Div>
      </>
    );
  }

  return (
    <>
      {heading}
      <CodeLiveEditor
        code={code}
        theme={theme}
        language={lang}
        id={props.id}
        hasDialog
        hasHeading={!!heading}
      />
    </>
  );
};

interface CodeLiveEditorProps
  extends Pick<CodeEditorProps, 'language' | 'theme'> {
  code: string;
  hasDialog?: boolean;
  hasHeading?: boolean;
  id?: string;
  className?: string;
}

const CodeLiveEditor = ({
  hasDialog,
  hasHeading,
  className,
  ...props
}: CodeLiveEditorProps) => {
  const [code, setCode] = React.useState(props.code);

  const { data, isFetching, isLoading, error, isError } =
    useCodeCompilation(code);

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
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <CodePreview code={data.code} importNames={data.importNames} />
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
            onChange={setCode}
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
          <CodeLiveEditor {...props} />
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

const InlineCode = styled('code', {
  fontFamily: '$mono',
  backgroundColor: '$gray-200',
  display: 'inline-block',
  px: '$1',
  borderRadius: '$sm',
});

const formatError = (error: string) => error.replace(/<stdin>:|\"\\x0A\"/g, '');