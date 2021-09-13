import { Language, PrismTheme } from 'prism-react-renderer';
import { CSSProperties, useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { Div } from './base';
import { CodeHighlight } from './code-highlight';
import { LanguageTag } from './language-tag';

export interface CodeEditorProps {
  code: string;
  language: Language;
  disabled?: boolean;
  onChange?: (newCode: string) => void;
  style?: CSSProperties;
  theme: PrismTheme;
  className?: string;
}

export const CodeEditor = ({
  code: providedCode,
  theme,
  language,
  ...props
}: CodeEditorProps) => {
  const [state, setState] = useState<{
    code: string;
    prevCodeProp?: string;
  }>({
    code: providedCode || '',
  });

  useEffect(() => {
    if (state.prevCodeProp && providedCode !== state.prevCodeProp) {
      setState({ code: providedCode, prevCodeProp: providedCode });
    }
  }, [providedCode]);

  const updateContent = (code: string) => {
    setState({ code });
  };

  useEffect(() => {
    if (props.onChange) {
      props.onChange(state.code);
    }
  }, [state.code]);

  const highlightCode = (code: string) => (
    <CodeHighlight code={code} theme={theme} language={language} />
  );

  // eslint-disable-next-line no-unused-vars
  const { style, onChange, ...rest } = props;

  const baseTheme = theme && typeof theme.plain === 'object' ? theme.plain : {};

  return (
    <Div
      css={{
        position: 'relative',
      }}
    >
      <Editor
        value={state.code}
        padding={10}
        highlight={highlightCode}
        onValueChange={updateContent}
        style={{
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          fontSize: '14px',
          ...(baseTheme as any),
          ...style,
        }}
        {...rest}
      />
      {language && <LanguageTag language={language} />}
    </Div>
  );
};
