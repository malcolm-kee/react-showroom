import { NON_VISUAL_LANGUAGES, SUPPORTED_LANGUAGES } from '@showroomjs/core';
import { styled } from '@showroomjs/ui';
import parseNumRange from 'parse-numeric-range';
import cx from 'classnames';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { Div } from './base';
import { CodeHighlight } from './code-highlight';
import { CodeLiveEditor, NonVisualCodeLiveEditor } from './code-live-editor';
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

export interface CodeProps extends React.ComponentPropsWithoutRef<'code'> {
  static?: boolean;
  inlineBlock?: boolean;
  fileName?: string;
  noEditor?: boolean;
  frame?: boolean;
  initialHeight?: string;
  height?: string;
  highlights?: string;
}

export const Code = ({
  static: isStatic,
  inlineBlock,
  fileName,
  noEditor,
  frame,
  initialHeight,
  height,
  highlights,
  ...props
}: CodeProps) => {
  const isBlockCode = React.useContext(IsBlockCodeContext);

  if (!isBlockCode || typeof props.children !== 'string') {
    return <InlineCode {...props} />;
  }

  const lang: any = props.className && props.className.split('-').pop();
  const code = props.children.trim();

  const heading = fileName ? (
    <Div
      css={{
        px: '$4',
        py: '$3',
        backgroundColor: '$gray-200',
        roundedT: '$md',
        fontSize: '$sm',
        lineHeight: '$sm',
      }}
    >
      <code>{fileName}</code>
    </Div>
  ) : null;

  const theme = useCodeTheme();

  const highlightedLines = React.useMemo(
    () => highlights && parseNumRange(highlights.replace(/^\{|\}$/g, '')),
    []
  );

  if (!SUPPORTED_LANGUAGES.includes(lang) || isStatic) {
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
            roundedT: heading ? '$none' : inlineBlock ? '$xl' : '$base',
            roundedB: inlineBlock ? '$xl' : '$base',
            whiteSpace: 'pre',
            fontFamily: 'monospace',
            position: 'relative',
            display: inlineBlock ? 'inline-block' : 'block',
            px: inlineBlock ? '$6' : 10,
            overflow: 'auto',
          }}
          className={cx('react-showroom-code', props.className)}
        >
          <CodeHighlight
            code={code}
            language={lang}
            theme={theme}
            highlights={highlightedLines || undefined}
          />
          {!inlineBlock && lang && <LanguageTag language={lang} />}
        </Div>
      </>
    );
  }

  return (
    <>
      {heading}
      {NON_VISUAL_LANGUAGES.includes(lang) ? (
        <NonVisualCodeLiveEditor
          code={code}
          lang={lang}
          id={props.id}
          noEditor={noEditor}
          frame={frame}
        />
      ) : (
        <CodeLiveEditor
          code={code}
          lang={lang}
          id={props.id}
          hasHeading={!!heading}
          noEditor={noEditor}
          frame={frame}
          initialHeight={initialHeight}
          height={height}
        />
      )}
    </>
  );
};

const InlineCode = styled('code', {
  fontFamily: '$mono',
  backgroundColor: '$gray-200',
  display: 'inline-block',
  px: '$1',
  borderRadius: '$sm',
});
