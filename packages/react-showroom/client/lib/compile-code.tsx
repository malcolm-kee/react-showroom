import type { CompileResult, RequestCompileData } from '@showroomjs/core';

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
