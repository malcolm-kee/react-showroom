import Highlight, { Language, Prism, PrismTheme } from 'prism-react-renderer';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import { CSSProperties, Fragment, useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';

export interface CodeEditorProps {
  code: string;
  language: Language;
  disabled?: boolean;
  onChange?: (newCode: string) => void;
  style?: CSSProperties;
  theme?: PrismTheme;
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
    <Highlight
      Prism={Prism}
      code={code}
      theme={theme}
      language={props.language}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Fragment>
      )}
    </Highlight>
  );

  // eslint-disable-next-line no-unused-vars
  const { style, onChange, ...rest } = props;
  const { code } = state;

  const baseTheme = theme && typeof theme.plain === 'object' ? theme.plain : {};

  return (
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
  );
};
