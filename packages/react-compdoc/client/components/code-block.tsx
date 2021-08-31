import * as React from 'react';
import { useQuery } from 'react-query';
import { compileCode } from '../lib/compile-code';
import { CodeEditor, CodeEditorProps } from './code-editor';
import { CodePreview } from './code-preview';

const IsBlockCodeContext = React.createContext(false);
IsBlockCodeContext.displayName = 'IsBlockCodeContext';

export const Pre = (props: { children: React.ReactNode }) => (
  <div>
    <IsBlockCodeContext.Provider value={true}>
      {props.children}
    </IsBlockCodeContext.Provider>
  </div>
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
      <div>{isCompiling && 'Compiling...'}</div>
      {data && <CodePreview code={data} />}
      <CodeEditor code={code} onChange={setCode} language={props.language} />
    </div>
  );
};
