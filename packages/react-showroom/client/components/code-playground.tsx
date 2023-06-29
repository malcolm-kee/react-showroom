import { SupportedLanguage } from '@showroomjs/core';
import { Collapsible, Tabs, tw } from '@showroomjs/ui';
import * as React from 'react';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { useHighlights } from '../lib/use-highlights';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { PropsEditorProvider } from '../lib/use-props-editor';
import { useTargetAudience } from '../lib/use-target-audience';
import { A11yResultPanel } from './a11y-result-panel';
import { A11ySummary } from './a11y-summary';
import {
  CodePreviewIframe,
  CodePreviewIframeImperative,
} from './code-preview-iframe';
import { CodePreviewShowroomFrame } from './code-preview-showroom-frame';
import { ConsolePanel } from './console-panel';
import { LinkToStandaloneView } from './link-to-standalone-view';
import { MeasuringButton } from './measuring-button';
import { PropsEditorPanel } from './props-editor-panel';

export interface CodePlaygroundProps {
  code: string;
  lang: SupportedLanguage;
  hasPropsEditor: boolean;
  frame?: boolean;
  initialHeight?: string;
  height?: string;
  initialWidth?: string;
  id?: string;
}

export const CodePlayground = ({
  hasPropsEditor,
  frame,
  initialHeight,
  height,
  initialWidth,
  id,
  ...props
}: CodePlaygroundProps) => {
  const [showDetails, setShowDetails] = React.useState<boolean | undefined>(
    !hasPropsEditor
  );

  const targetAudience = useTargetAudience();

  const codeBlocks = useCodeBlocks();
  const matchedCodeData = codeBlocks[props.code];

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

  const [activeTab, setActiveTab] = React.useState('props');

  return (
    <PropsEditorProvider
      codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
    >
      <PreviewConsoleProvider>
        <div
          className={tw([
            'relative rounded-t',
            frame
              ? 'w-full bg-zinc-400 rounded-br'
              : 'min-h-[48px] border border-zinc-300',
          ])}
        >
          {frame ? (
            <CodePreviewIframe
              code={props.code}
              lang={props.lang}
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
              imperativeRef={frameRef}
              resizable
            />
          ) : (
            <CodePreviewShowroomFrame code={props.code} lang={props.lang} />
          )}
        </div>
        <ConsolePanel />
      </PreviewConsoleProvider>
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <div className={tw(['flex justify-between py-1'])}>
          <Collapsible.Button
            className={tw(['flex items-center gap-1 text-sm'])}
          >
            <Collapsible.ToggleIcon
              direction={showDetails ? 'up' : 'down'}
              aria-label={showDetails ? 'Hide Details' : 'View Details'}
            />
            Details
          </Collapsible.Button>
          <div className={tw(['inline-flex gap-1'])}>
            <A11ySummary
              onClick={() => {
                setShowDetails(true);
                setActiveTab('a11y');
              }}
              className={tw(['px-2 border-r border-r-zinc-300'])}
            />
            {frame && (
              <>
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
              </>
            )}
            <LinkToStandaloneView
              codeHash={matchedCodeData && matchedCodeData.initialCodeHash}
              isDesigner={targetAudience === 'designer'}
            />
          </div>
        </div>
        <Collapsible.Content animate>
          {hasPropsEditor ? (
            <div className={tw(['bg-zinc-200'])}>
              <A11yResultPanel highlightItems={highlightFrameItems} />
            </div>
          ) : (
            <Tabs.Root
              value={activeTab}
              onValueChange={(tab) => {
                setActiveTab(tab);
                if (tab === 'props') {
                  highlightFrameItems([], '');
                }
              }}
            >
              <Tabs.List>
                <Tabs.Trigger value="props">Props</Tabs.Trigger>
                <Tabs.Trigger value="a11y">Accessibility</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="props">
                <PropsEditorPanel />
              </Tabs.Content>
              <Tabs.Content value="a11y">
                <A11yResultPanel highlightItems={highlightFrameItems} />
              </Tabs.Content>
            </Tabs.Root>
          )}
        </Collapsible.Content>
      </Collapsible>
    </PropsEditorProvider>
  );
};
