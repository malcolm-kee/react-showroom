import type {
  CodeBlocks,
  CompileResult,
  RequestCompileData,
} from '@compdoc/core';
import * as React from 'react';
import { useQuery } from 'react-query';

const worker = new Worker(new URL('./compile-worker.js', import.meta.url));

let id = 0;

export const compileCode = (code: string) =>
  new Promise<CompileResult>((fulfill) => {
    const messageId = id++;

    const compileEvent: RequestCompileData = {
      messageId,
      source: code,
    };
    worker.postMessage(compileEvent);

    function handleMessage(ev: MessageEvent) {
      const data: CompileResult = ev.data;
      if (messageId === data.messageId) {
        fulfill(data);
        worker.removeEventListener('message', handleMessage);
      }
    }

    worker.addEventListener('message', handleMessage);
  });

const CodeBlocksContext = React.createContext<CodeBlocks>({});
CodeBlocksContext.displayName = 'CodeBlocksContext';

export const CodeBlocksProvider = CodeBlocksContext.Provider;

export const useCodeCompilation = (providedCode: string) => {
  const code = providedCode.trim();

  const blocks = React.useContext(CodeBlocksContext);

  return useQuery({
    queryKey: ['codeCompilation', code],
    queryFn: () => compileCode(code),
    initialData: blocks[code],
    keepPreviousData: true,
  });
};
