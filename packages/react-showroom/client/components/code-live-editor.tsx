import { ArrowsExpandIcon } from '@heroicons/react/outline';
import { removeTrailingSlash, SupportedLanguage } from '@showroomjs/core';
import { Collapsible, css, icons, styled, useDebounce } from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { useParentFrame } from '../lib/frame-message';
import { Link, useRouteMatch } from '../lib/routing';
import { Div } from './base';
import { BrowserWindow } from './browser-window';
import { CodeEditor } from './code-editor';
import { CodePreviewFrame } from './code-preview-frame';

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

  const { targetRef, sendMessage } = useParentFrame();

  const encodedCode = React.useMemo(
    () => encodeURIComponent(props.code),
    [props.code]
  );

  React.useEffect(() => {
    sendMessage({ type: 'code', code: debouncedCode, lang: props.lang });
  }, [debouncedCode]);

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
          resize: frame ? 'horizontal' : 'none',
          overflow: frame ? 'hidden' : undefined,
        }}
      >
        {frame ? (
          <Frame
            ref={targetRef}
            src={`/_preview.html?lang=${props.lang}&code=${encodedCode}`}
          />
        ) : (
          <CodePreviewFrame code={debouncedCode} lang={props.lang} />
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

const Frame = styled('iframe', {
  width: '100%',
});
