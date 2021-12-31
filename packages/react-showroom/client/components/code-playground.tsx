import { SupportedLanguage } from '@showroomjs/core';
import { Collapsible, Tabs } from '@showroomjs/ui';
import * as React from 'react';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { useHighlights } from '../lib/use-highlights';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { PropsEditorProvider } from '../lib/use-props-editor';
import { useTargetAudience } from '../lib/use-target-audience';
import { A11yResultPanel } from './a11y-result-panel';
import { A11ySummary } from './a11y-summary';
import { Div } from './base';
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
}

export const CodePlayground = ({
  hasPropsEditor,
  frame,
  initialHeight,
  height,
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
    <PropsEditorProvider>
      <PreviewConsoleProvider>
        <Div
          css={{
            position: 'relative',
            roundedT: '$base',
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
              imperativeRef={frameRef}
              resizable
            />
          ) : (
            <CodePreviewShowroomFrame code={props.code} lang={props.lang} />
          )}
        </Div>
        <ConsolePanel />
      </PreviewConsoleProvider>
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
              aria-label={showDetails ? 'Hide Details' : 'View Details'}
              width="16"
              height="16"
            />
            Details
          </Collapsible.Button>
          <Div
            css={{
              display: 'inline-flex',
              gap: '$1',
            }}
          >
            <A11ySummary
              onClick={() => {
                setShowDetails(true);
                setActiveTab('a11y');
              }}
              css={{
                px: '$2',
                borderRight: '1px solid $gray-300',
              }}
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
          </Div>
        </Div>
        <Collapsible.Content animate>
          {hasPropsEditor ? (
            <Div
              css={{
                backgroundColor: '$gray-200',
              }}
            >
              <A11yResultPanel highlightItems={highlightFrameItems} />
            </Div>
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
      </Collapsible.Root>
    </PropsEditorProvider>
  );
};
