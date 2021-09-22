import type {
  CompileResult,
  RequestCompileData,
  SupportedLanguage,
} from '@showroomjs/core';
import CompileWorker from './compile-worker?worker';

let worker: Worker;

let id = 0;

export const compileCode = (code: string, lang: SupportedLanguage) =>
  new Promise<CompileResult>((fulfill) => {
    // hack to make vite copy esbuild.wasm
    import('esbuild-wasm/esbuild.wasm?url');

    const currentWorker = (function getWorker() {
      if (worker) {
        return worker;
      }
      worker = new CompileWorker();
      return worker;
    })();

    const messageId = id++;

    const compileEvent: RequestCompileData = {
      messageId,
      lang,
      source: code,
    };
    currentWorker.postMessage(compileEvent);

    function handleMessage(ev: MessageEvent) {
      const data: CompileResult = ev.data;
      if (messageId === data.messageId) {
        fulfill(data);
        currentWorker.removeEventListener('message', handleMessage);
      }
    }

    currentWorker.addEventListener('message', handleMessage);
  });
