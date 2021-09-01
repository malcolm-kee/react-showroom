import * as React from 'react';
import { useQuery } from 'react-query';
import { compileCode } from '../lib/compile-code';
import { Div } from './base';
import { CodeEditor, CodeEditorProps } from './code-editor';
import { CodePreview } from './code-preview';

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
}) => {
  const isBlockCode = React.useContext(IsBlockCodeContext);

  if (!isBlockCode) {
    return <code {...props} />;
  }

  const lang = props.className && props.className.split('-').pop();

  return (
    <CodeLiveEditor code={props.children as string} language={lang as any} />
  );
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
          px: '$3',
          py: '$1',
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
      <CodeEditor code={code} onChange={setCode} language={props.language} />
    </div>
  );
};
