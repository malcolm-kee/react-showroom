import type {
  CompileResult,
  RequestCompileData,
  SupportedLanguage,
} from '@showroomjs/core';
import Worker from './compile-worker?worker';

const worker = new Worker();

let id = 0;

export const compileCode = (code: string, lang: SupportedLanguage) =>
  new Promise<CompileResult>((fulfill) => {
    const messageId = id++;

    const compileEvent: RequestCompileData = {
      messageId,
      lang,
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
