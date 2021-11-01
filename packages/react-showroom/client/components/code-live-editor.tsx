import { ArrowsExpandIcon } from '@heroicons/react/outline';
import { removeTrailingSlash, SupportedLanguage } from '@showroomjs/core';
import { Collapsible, css, icons, styled, useDebounce } from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { Link, useRouteMatch } from '../lib/routing';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { useTargetAudience } from '../lib/use-target-audience';
import { Div } from './base';
import { BrowserWindow } from './browser-window';
import { CodeEditor } from './code-editor';
import { CodePreviewFrame } from './code-preview-frame';
import { CodePreviewIframe } from './code-preview-iframe';
import { ConsolePanel } from './console-panel';

export interface CodeLiveEditorProps {
  code: string;
  lang: SupportedLanguage;
  hasHeading?: boolean;
  id?: string;
  className?: string;
  noEditor?: boolean;
  frame?: boolean;
}

export const CodeLiveEditor = ({
  hasHeading,
  className,
  noEditor,
  frame,
  ...props
}: CodeLiveEditorProps) => {
  const theme = useCodeTheme();

  const [code, setCode] = React.useState(props.code);

  const debouncedCode = useDebounce(code);

  const [showCode, setShowCode] = React.useState<boolean | undefined>(false);

  const codeBlocks = useCodeBlocks();
  const matchedCodeData = codeBlocks[props.code];

  const targetAudience = useTargetAudience();
  const isDeveloper = targetAudience === 'developer';

  const content = (
    <PreviewConsoleProvider>
      <Div
        css={{
          position: 'relative',
          roundedT: hasHeading ? '$none' : '$base',
          ...(frame
            ? {
                backgroundColor: '$gray-400',
                borderBottomRightRadius: '$base',
                width: '100%',
                overflowX: 'hidden',
              }
            : {
                minHeight: 48,
                border: '1px solid',
                borderColor: '$gray-300',
              }),
        }}
      >
        {frame ? (
          <CodePreviewIframe
            code={debouncedCode}
            lang={props.lang}
            codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
            resizable
          />
        ) : (
          <CodePreviewFrame code={debouncedCode} lang={props.lang} />
        )}
      </Div>
      <ConsolePanel />
      {!noEditor && (
        <Collapsible.Root open={showCode} onOpenChange={setShowCode}>
          <Div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              py: '$1',
            }}
          >
            {isDeveloper ? (
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
            ) : (
              <span />
            )}
            <LinkToStandaloneView
              codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
              isDesigner={targetAudience === 'designer'}
            />
          </Div>
          {isDeveloper && (
            <Collapsible.Content animate>
              <CodeEditor
                code={code}
                onChange={setCode}
                language={props.lang as Language}
                className={editorBottom()}
                theme={theme}
              />
            </Collapsible.Content>
          )}
        </Collapsible.Root>
      )}
    </PreviewConsoleProvider>
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

const LinkToStandaloneView = (props: {
  codeHash: string | undefined;
  isDesigner: boolean;
}) => {
  const { url } = useRouteMatch();

  return props.codeHash ? (
    <Button
      as={Link}
      to={`${removeTrailingSlash(url)}/_standalone/${props.codeHash}${
        props.isDesigner ? '?commentMode=true' : ''
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
