import { SupportedLanguage } from '@showroomjs/core';
import { Collapsible } from '@showroomjs/ui';
import * as React from 'react';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { PreviewConsoleProvider } from '../lib/use-preview-console';
import { PropsEditorProvider } from '../lib/use-props-editor';
import { useTargetAudience } from '../lib/use-target-audience';
import { Div } from './base';
import { CodePreviewFrame } from './code-preview-frame';
import {
  CodePreviewIframe,
  CodePreviewIframeImperative,
} from './code-preview-iframe';
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
  const [showPropsEditor, setShowPropsEditor] = React.useState<
    boolean | undefined
  >(true);

  const targetAudience = useTargetAudience();

  const codeBlocks = useCodeBlocks();
  const matchedCodeData = codeBlocks[props.code];

  const initialHeightValue = initialHeight && Number(initialHeight);
  const heightValue = height && Number(height);

  const frameRef = React.useRef<CodePreviewIframeImperative>(null);
  const [isMeasuring, setIsMeasuring] = React.useState(false);

  const content = (
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
          <CodePreviewFrame code={props.code} lang={props.lang} />
        )}
      </Div>
      <ConsolePanel />
    </PreviewConsoleProvider>
  );

  return hasPropsEditor ? (
    content
  ) : (
    <PropsEditorProvider>
      {content}
      <Collapsible.Root
        open={showPropsEditor}
        onOpenChange={setShowPropsEditor}
      >
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
              hide={showPropsEditor}
              aria-label={
                showPropsEditor ? 'Hide Props Editor' : 'View Props Editor'
              }
              width="16"
              height="16"
            />
            Props
          </Collapsible.Button>
          <Div
            css={{
              display: 'inline-flex',
              gap: '$1',
            }}
          >
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
          <PropsEditorPanel />
        </Collapsible.Content>
      </Collapsible.Root>
    </PropsEditorProvider>
  );
};
