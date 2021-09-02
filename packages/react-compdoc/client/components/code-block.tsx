import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import * as React from 'react';
import { useQuery } from 'react-query';
import { compileCode } from '../lib/compile-code';
import { css } from '../stitches.config';
import { Div } from './base';
import { CodeEditor, CodeEditorProps } from './code-editor';
import { CodeHighlight } from './code-highlight';
import { CodePreview } from './code-preview';
import * as Collapsible from './collapsible';

const IsBlockCodeContext = React.createContext(false);
IsBlockCodeContext.displayName = 'IsBlockCodeContext';

export const Pre = (props: { children: React.ReactNode }) => (
  <Div
    css={{
      marginBottom: '$4',
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
}) => {
  const isBlockCode = React.useContext(IsBlockCodeContext);

  if (!isBlockCode) {
    return <code {...props} />;
  }

  const lang: any = props.className && props.className.split('-').pop();

  if (props.static) {
    const theme = nightOwlTheme;

    return (
      <Div
        style={{
          ...(typeof theme.plain === 'object' ? (theme.plain as any) : {}),
        }}
        css={{
          padding: 10,
          fontSize: 13,
          borderRadius: '$base',
          whiteSpace: 'pre',
          fontFamily: 'monospace',
        }}
      >
        <CodeHighlight
          code={props.children as string}
          language={lang}
          theme={theme}
        />
      </Div>
    );
  }

  return <CodeLiveEditor code={props.children as string} language={lang} />;
};

const CodeLiveEditor = (
  props: { code: string } & Pick<CodeEditorProps, 'language'>
) => {
  const [code, setCode] = React.useState(props.code);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['codeCompilation', code],
    queryFn: () => compileCode(code as string),
    keepPreviousData: true,
  });

  const isCompiling = isFetching || isLoading;

  return (
    <div>
      <Div
        css={{
          position: 'relative',
          minHeight: 48,
          border: '1px solid',
          borderColor: '$gray-300',
          padding: '$1',
          roundedT: '$base',
        }}
      >
        {data && <CodePreview code={data} />}
        {isCompiling && (
          <Div
            css={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '$gray-200',
              opacity: 0.5,
            }}
          >
            Compiling...
          </Div>
        )}
      </Div>
      <Collapsible.Root>
        <Div
          css={{
            px: '$2',
            py: '$1',
          }}
        >
          <Collapsible.Button>View/Edit Code</Collapsible.Button>
        </Div>
        <Collapsible.Content>
          <CodeEditor
            code={code}
            onChange={setCode}
            language={props.language}
            className={editorBottom()}
          />
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
};

const editorBottom = css({
  borderRadius: '$base',
});
