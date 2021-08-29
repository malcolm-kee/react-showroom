import type { CompileResult, RequestCompileData } from '../types';

const worker = new Worker(new URL('./compile-worker.ts', import.meta.url));

let id = 0;

export const compileCode = (code: string) =>
  new Promise<string>((fulfill, reject) => {
    const messageId = id++;

    const compileEvent: RequestCompileData = {
      messageId,
      source: code,
    };
    worker.postMessage(compileEvent);

    function handleMessage(ev: MessageEvent) {
      const data: CompileResult = ev.data;
      if (messageId === data.messageId) {
        if (data.type === 'success') {
          fulfill(data.code);
        } else {
          reject(new Error(data.error));
        }
        worker.removeEventListener('message', handleMessage);
      }
    }

    worker.addEventListener('message', handleMessage);
  });
