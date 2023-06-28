import { SupportedLanguage } from '@showroomjs/core';
import { Collapsible, Tabs, tw, useDebounce } from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { useHighlights } from '../lib/use-highlights';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { useTargetAudience } from '../lib/use-target-audience';
import { A11yResultPanel } from './a11y-result-panel';
import { A11ySummary } from './a11y-summary';
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
  initialWidth?: string;
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
  initialWidth,
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

  const initialWidthValue = initialWidth && Number(initialWidth);

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

  const [activeTab, setActiveTab] = React.useState('code');

  const a11yPanelOnly = noEditor || !isDeveloper;

  return (
    <div className={className}>
      <PreviewConsoleProvider>
        <div
          className={tw([
            'relative',
            !hasHeading && 'rounded-t',
            frame
              ? 'w-full bg-zinc-400 rounded-br'
              : 'min-h-[48px] border border-zinc-300',
          ])}
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
              initialWidth={
                initialWidthValue && !isNaN(initialWidthValue)
                  ? initialWidthValue
                  : undefined
              }
              resizable
              imperativeRef={frameRef}
            />
          ) : (
            <CodePreviewShowroomFrame code={debouncedCode} lang={lang} />
          )}
        </div>
        <ConsolePanel />
        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
          <div className={tw(['flex justify-between py-1'])}>
            <Collapsible.Button
              className={tw(['flex items-center gap-1 text-sm'])}
            >
              <Collapsible.ToggleIcon
                direction={showDetails ? 'up' : 'down'}
                aria-label={showDetails ? 'Hide' : 'View'}
              />
              {a11yPanelOnly ? 'Accessibility' : 'Details'}
            </Collapsible.Button>
            <div className={tw(['inline-flex gap-1'])}>
              <A11ySummary
                onClick={() => {
                  setShowDetails(true);
                  if (!a11yPanelOnly) {
                    setActiveTab('a11y');
                  }
                }}
                className={tw([
                  'px-2',
                  (frame || !noEditor) && 'border-r border-r-zinc-300',
                ])}
              />
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
              {!noEditor && (
                <LinkToStandaloneView
                  codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
                  isDesigner={targetAudience === 'designer'}
                />
              )}
            </div>
          </div>
          <Collapsible.Content animate>
            {a11yPanelOnly ? (
              <div className={tw(['bg-zinc-200'])}>
                <A11yResultPanel highlightItems={highlightFrameItems} />
              </div>
            ) : (
              <Tabs.Root
                value={activeTab}
                onValueChange={(tab) => {
                  setActiveTab(tab);
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
                    className={tw(['rounded'])}
                    theme={theme}
                  />
                </Tabs.Content>
                <Tabs.Content value="a11y">
                  <A11yResultPanel highlightItems={highlightFrameItems} />
                </Tabs.Content>
              </Tabs.Root>
            )}
          </Collapsible.Content>
        </Collapsible>
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
            className={tw(['rounded'])}
            theme={theme}
          />
        )}
        <div className={tw(['relative'])}>
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
        </div>
        <ConsolePanel defaultIsOpen isCompiling={isCompiling} />
      </PreviewConsoleProvider>
    </div>
  );
};
