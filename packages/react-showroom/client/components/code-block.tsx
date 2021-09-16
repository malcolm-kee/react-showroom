import { SUPPORTED_LANGUAGES } from '@showroomjs/core';
import { styled } from '@showroomjs/ui';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { Div } from './base';
import { CodeHighlight } from './code-highlight';
import { CodeLiveEditor } from './code-live-editor';
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
        px: '$4',
        py: '$3',
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
            overflowX: 'auto',
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

const InlineCode = styled('code', {
  fontFamily: '$mono',
  backgroundColor: '$gray-200',
  display: 'inline-block',
  px: '$1',
  borderRadius: '$sm',
});
