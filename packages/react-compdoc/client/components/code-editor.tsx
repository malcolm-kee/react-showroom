import { Language, PrismTheme } from 'prism-react-renderer';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import { CSSProperties, useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { CodeHighlight } from './code-highlight';
import { Div } from './base';
import { LanguageTag } from './language-tag';

export interface CodeEditorProps {
  code: string;
  language: Language;
  disabled?: boolean;
  onChange?: (newCode: string) => void;
  style?: CSSProperties;
  theme?: PrismTheme;
  className?: string;
}

export const CodeEditor = (props: CodeEditorProps) => {
  const theme = props.theme ?? nightOwlTheme;

  const [state, setState] = useState<{
    code: string;
    prevCodeProp?: string;
  }>({
    code: props.code || '',
  });

  useEffect(() => {
    if (state.prevCodeProp && props.code !== state.prevCodeProp) {
      setState({ code: props.code, prevCodeProp: props.code });
    }
  }, [props.code]);

  const updateContent = (code: string) => {
    setState({ code });
  };

  useEffect(() => {
    if (props.onChange) {
      props.onChange(state.code);
    }
  }, [state.code]);

  const highlightCode = (code: string) => (
    <CodeHighlight code={code} theme={theme} language={props.language} />
  );

  // eslint-disable-next-line no-unused-vars
  const { style, onChange, ...rest } = props;
  const { code } = state;

  const baseTheme = theme && typeof theme.plain === 'object' ? theme.plain : {};

  return (
    <Div
      css={{
        position: 'relative',
      }}
    >
      <Editor
        value={code}
        padding={10}
        highlight={highlightCode}
        onValueChange={updateContent}
        style={{
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          ...(baseTheme as any),
          ...style,
        }}
        {...rest}
      />
      {props.language && <LanguageTag language={props.language} />}
    </Div>
  );
};
