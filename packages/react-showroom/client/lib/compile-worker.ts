/// <reference lib="WebWorker" />

import {
  CompilationError,
  CompileResult,
  postCompile,
  processHtml,
  RequestCompileData,
  toHtmlExample,
  compileTarget,
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
    Promise.all([processHtml(data.source), esBuildIsReady])
      .then(([{ html, script }]) =>
        esbuild
          .transform(script, {
            loader: 'js',
            target: compileTarget,
          })
          .then((transpiledScript) => {
            const postCompileResult = postCompile(transpiledScript.code);

            const result: CompileResult = {
              ...postCompileResult,
              code: toHtmlExample({
                script: postCompileResult.code,
                html,
              }),
              type: 'success',
              messageId: data.messageId,
              lang: data.lang,
            };

            self.postMessage(result);
          })
      )
      .catch(handleError);
  } else {
    esBuildIsReady
      .then(() =>
        esbuild
          .transform(data.source, {
            loader: lang,
            target: compileTarget,
          })
          .then((transformOutput) => {
            const compileResult = postCompile(transformOutput.code, {
              insertRenderIfEndWithJsx: true,
            });

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

function getCode(data: RequestCompileData) {
  if (data.lang === 'html') {
    return processHtml(data.source);
  }
  return Promise.resolve(data.source);
}

const errorRegex = /Transform failed with \d+ error:\s+<stdin>:(\d+):(\d+):/;
