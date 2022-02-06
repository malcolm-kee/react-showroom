import { compileTests } from '@showroomjs/core';
import * as esbuild from 'esbuild';
import type { LoaderDefinition } from 'webpack';
import { isSupportedExt } from '../lib/esbuild-util';

const showroomTestLoader: LoaderDefinition = function (source) {
  const callback = this.async();
  const filePath = this.resourcePath;

  const match = filePath.match(/\.(\w+)$/);

  if (!match) {
    return callback(new Error(`${filePath} is not having supported ext.`));
  }

  const ext = match[1];

  if (!isSupportedExt(ext)) {
    return callback(new Error(`${filePath} is not having supported ext.`));
  }

  (async function compile() {
    try {
      const transformResult = await esbuild.transform(source, {
        loader: ext,
      });

      const testFileContent = compileTests(transformResult.code);

      callback(null, testFileContent);
    } catch (err) {
      callback(err as Error);
    }
  })();
};

module.exports = showroomTestLoader;
