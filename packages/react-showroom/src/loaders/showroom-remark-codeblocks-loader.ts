import { CodeBlocks, postCompile, SUPPORTED_LANGUAGES } from '@showroomjs/core';
import * as esbuild from 'esbuild';
import remarkParse from 'remark-parse';
import unified from 'unified';
import vFile from 'vfile';
import type { LoaderDefinition } from 'webpack';
import { codeblocks } from '../lib/codeblocks';

const parser = unified().use(remarkParse as any);

const showroomRemarkLoader: LoaderDefinition = function (source, map, meta) {
  const cb = this.async();

  const tree = parser.parse(vFile(source));

  const blocks: Record<string, Array<string>> = codeblocks(tree).codeblocks;

  const result: CodeBlocks = {};

  async function transformCodes() {
    for (const lang of Object.keys(blocks)) {
      if (SUPPORTED_LANGUAGES.includes(lang)) {
        for (const code of blocks[lang]) {
          try {
            const transformResult = await esbuild.transform(code, {
              loader: 'tsx',
              target: 'es2018',
            });

            const postTranspileResult = postCompile(transformResult.code);

            result[code] = {
              ...postTranspileResult,
              type: 'success',
              messageId: -1,
            };
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  }

  transformCodes().finally(() => {
    cb(null, `module.exports = ${JSON.stringify(result)};`, map, meta);
  });
};

module.exports = showroomRemarkLoader;
