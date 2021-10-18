/// <reference lib="WebWorker" />

import {
  CompilationError,
  CompileResult,
  postCompile,
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

  esBuildIsReady
    .then(() =>
      esbuild
        .transform(data.source, {
          loader: data.lang,
          target: 'es2018',
        })
        .then((transformOutput) => {
          const compileResult = postCompile(transformOutput.code);

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
};

const errorRegex = /Transform failed with \d+ error:\s+<stdin>:(\d+):(\d+):/;
