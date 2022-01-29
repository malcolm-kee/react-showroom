import { compileTestsToMap } from '@showroomjs/core';
import * as esbuild from 'esbuild';
import type { LoaderDefinition } from 'webpack';
import { isSupportedExt } from '../lib/esbuild-util';

const showroomTestNameLoader: LoaderDefinition = function (source) {
  const callback = this.async();

  const match = this.resourcePath.match(/\.(\w+)$/);

  if (!match) {
    return callback(
      new Error(`${this.resourcePath} is not having supported ext.`)
    );
  }

  const ext = match[1];

  if (!isSupportedExt(ext)) {
    return callback(
      new Error(`${this.resourcePath} is not having supported ext.`)
    );
  }

  (async function compile() {
    try {
      const transformResult = await esbuild.transform(source, {
        loader: ext,
      });

      const result = compileTestsToMap(transformResult.code);

      return callback(null, result);
    } catch (err) {
      callback(err as Error);
    }
  })();
};

module.exports = showroomTestNameLoader;
