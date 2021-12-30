import { SupportedLanguage } from '@showroomjs/core';
import { Collapsible, css, Tabs, useDebounce } from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { useHighlights } from '../lib/use-highlights';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { useTargetAudience } from '../lib/use-target-audience';
import { A11yResultPanel } from './a11y-result-panel';
import { A11ySummary } from './a11y-summary';
import { Div } from './base';
import { CodeEditor } from './code-editor';
import { CodePreviewFrame } from './code-preview-frame';
import {
  CodePreviewIframe,
  CodePreviewIframeImperative,
} from './code-preview-iframe';
import { CodePreviewShowroomFrame } from './code-preview-showroom-frame';
import { ConsolePanel } from './console-panel';
import { LinkToStandaloneView } from './link-to-standalone-view';
import { MeasuringButton } from './measuring-button';

export interface CodeLiveEditorProps {
  code: string;
  lang: SupportedLanguage;
  hasHeading?: boolean;
  id?: string;
  className?: string;
  noEditor?: boolean;
  frame?: boolean;
  initialHeight?: string;
  height?: string;
}

export const CodeLiveEditor = ({
  hasHeading,
  className,
  noEditor,
  lang,
  frame = lang === 'html',
  initialHeight,
  height,
  ...props
}: CodeLiveEditorProps) => {
  const theme = useCodeTheme();

  const [code, setCode] = React.useState(props.code);

  const debouncedCode = useDebounce(code);

  const [showDetails, setShowDetails] = React.useState<boolean | undefined>(
    false
  );

  const codeBlocks = useCodeBlocks();
  const matchedCodeData = codeBlocks[props.code];

  const targetAudience = useTargetAudience();
  const isDeveloper = targetAudience === 'developer';

  const initialHeightValue = initialHeight && Number(initialHeight);
  const heightValue = height && Number(height);

  const frameRef = React.useRef<CodePreviewIframeImperative>(null);
  const [isMeasuring, setIsMeasuring] = React.useState(false);
  const highlightCurrentFrameItems = useHighlights();

  const highlightFrameItems = React.useCallback(
    (selectors: string[], newColor: string) => {
      if (frame) {
        if (frameRef.current) {
          frameRef.current.sendToChild({
            type: 'highlightElements',
            selectors,
            color: newColor,
          });
        }
      } else {
        highlightCurrentFrameItems(selectors, newColor);
      }
    },
    [highlightCurrentFrameItems]
  );

  const a11yPanelOnly = noEditor || !isDeveloper;

  return (
    <div className={className}>
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
              lang={lang}
              codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
              initialHeight={
                initialHeightValue && !isNaN(initialHeightValue)
                  ? initialHeightValue
                  : undefined
              }
              height={
                heightValue && !isNaN(heightValue) ? heightValue : undefined
              }
              resizable
              imperativeRef={frameRef}
            />
          ) : (
            <CodePreviewShowroomFrame code={debouncedCode} lang={lang} />
          )}
        </Div>
        <ConsolePanel />
        <Collapsible.Root open={showDetails} onOpenChange={setShowDetails}>
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
                hide={showDetails}
                aria-label={showDetails ? 'Hide' : 'View'}
                width="16"
                height="16"
              />
              {a11yPanelOnly ? 'Accessibility' : 'Details'}
            </Collapsible.Button>
            <Div
              css={{
                display: 'inline-flex',
                gap: '$1',
              }}
            >
              <A11ySummary />
              {frame && (
                <MeasuringButton
                  onClick={() => {
                    if (frameRef.current) {
                      const nextIsMeasuring = !isMeasuring;

                      frameRef.current.sendToChild({
                        type: 'toggleMeasure',
                        active: nextIsMeasuring,
                      });
                      setIsMeasuring(nextIsMeasuring);
                    }
                  }}
                  isActive={isMeasuring}
                />
              )}
              <LinkToStandaloneView
                codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
                isDesigner={targetAudience === 'designer'}
              />
            </Div>
          </Div>
          <Collapsible.Content animate>
            {a11yPanelOnly ? (
              <Div
                css={{
                  backgroundColor: '$gray-200',
                }}
              >
                <A11yResultPanel highlightItems={highlightFrameItems} />
              </Div>
            ) : (
              <Tabs.Root
                defaultValue="code"
                onValueChange={(tab) => {
                  if (tab === 'code') {
                    highlightFrameItems([], '');
                  }
                }}
              >
                <Tabs.List>
                  <Tabs.Trigger value="code">Code</Tabs.Trigger>
                  <Tabs.Trigger value="a11y">Accessibility</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="code">
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    language={lang as Language}
                    className={editorBottom()}
                    theme={theme}
                  />
                </Tabs.Content>
                <Tabs.Content value="a11y">
                  <A11yResultPanel highlightItems={highlightFrameItems} />
                </Tabs.Content>
              </Tabs.Root>
            )}
          </Collapsible.Content>
        </Collapsible.Root>
      </PreviewConsoleProvider>
    </div>
  );
};

export const NonVisualCodeLiveEditor = (props: {
  code: string;
  lang: SupportedLanguage;
  id?: string;
  className?: string;
  noEditor?: boolean;
  frame?: boolean;
}) => {
  const theme = useCodeTheme();

  const [code, setCode] = React.useState(props.code);

  const debouncedCode = useDebounce(code);
  const codeBlocks = useCodeBlocks();
  const matchedCodeData = codeBlocks[props.code];

  const [isCompiling, setIsCompiling] = React.useState(false);

  return (
    <div className={props.className} id={props.id}>
      <PreviewConsoleProvider>
        {props.noEditor ? null : (
          <CodeEditor
            code={code}
            onChange={setCode}
            language={props.lang as Language}
            className={editorBottom()}
            theme={theme}
          />
        )}
        <Div
          css={{
            position: 'relative',
          }}
        >
          {props.frame ? (
            <CodePreviewIframe
              code={debouncedCode}
              lang={props.lang}
              codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
              nonVisual
              onIsCompilingChange={setIsCompiling}
            />
          ) : (
            <CodePreviewFrame
              code={debouncedCode}
              lang={props.lang}
              nonVisual
              onIsCompilingChange={setIsCompiling}
            />
          )}
        </Div>
        <ConsolePanel defaultIsOpen isCompiling={isCompiling} />
      </PreviewConsoleProvider>
    </div>
  );
};

const editorBottom = css({
  borderRadius: '$base',
});
