/// <reference lib="WebWorker" />

import * as esbuild from 'esbuild-wasm';
import wasmPath from 'esbuild-wasm/esbuild.wasm';
import type { RequestCompileData, CompileResult } from '../types';

const esBuildIsReady = esbuild.initialize({
  wasmURL: wasmPath,
  worker: false,
});

self.onmessage = (ev) => {
  const data: RequestCompileData = ev.data;

  const handleError = (err: unknown) => {
    const errorResult: CompileResult = {
      type: 'error',
      error: String(err),
      messageId: data.messageId,
    };
    self.postMessage(errorResult);
  };

  esBuildIsReady
    .then(() =>
      esbuild
        .transform(data.source, {
          loader: 'tsx',
        })
        .then((transformOutput) => {
          const result: CompileResult = {
            type: 'success',
            code: transformOutput.code,
            messageId: data.messageId,
          };
          self.postMessage(result);
        })
    )
    .catch(handleError);
};
