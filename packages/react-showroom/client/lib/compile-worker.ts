/// <reference lib="WebWorker" />

import {
  CompilationError,
  compileHtml,
  CompileResult,
  compileScript,
  RequestCompileData,
} from '@showroomjs/core';
import wasmPath from 'esbuild-wasm/esbuild.wasm';
import * as esbuild from 'esbuild-wasm/esm/browser';

const esBuildIsReady = esbuild.initialize({
  wasmURL: wasmPath,
  worker: false,
});

self.onmessage = (ev) => {
  const data: RequestCompileData = ev.data;

  const handleError = (err: unknown) => {
    const errString = err instanceof Error ? err.message : String(err);

    const match = errString.match(errorRegex);

    const meta: CompilationError | undefined = match
      ? {
          type: 'compilationError',
          line: Number(match[1]),
        }
      : undefined;

    const errorResult: CompileResult = {
      type: 'error',
      error: String(err),
      messageId: data.messageId,
      meta,
    };
    self.postMessage(errorResult);
  };

  const lang = data.lang;

  if (lang === 'html') {
    esBuildIsReady
      .then(() => compileHtml(data.source, esbuild))
      .then((htmlCompileResult) => {
        const result: CompileResult = {
          ...htmlCompileResult,
          type: 'success',
          messageId: data.messageId,
          lang: data.lang,
        };
        self.postMessage(result);
      })
      .catch(handleError);
  } else {
    esBuildIsReady
      .then(() =>
        compileScript(data.source, esbuild, {
          insertRenderIfEndWithJsx: true,
          language: lang,
        }).then((compileResult) => {
          const result: CompileResult = {
            ...compileResult,
            type: 'success',
            messageId: data.messageId,
            lang: data.lang,
          };
          self.postMessage(result);
        })
      )
      .catch(handleError);
  }
};

const errorRegex = /Transform failed with \d+ error:\s+<stdin>:(\d+):(\d+):/;
