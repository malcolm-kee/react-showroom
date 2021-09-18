import {
  CodeBlocks,
  postCompile,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from '@showroomjs/core';
import * as esbuild from 'esbuild';
import type { Parent as MdParent, Code as MdCode } from 'mdast';
import remarkParse from 'remark-parse';
import unified from 'unified';
import vFile from 'vfile';
import type { LoaderDefinition } from 'webpack';
import { codeblocks } from '../lib/codeblocks';
import { createHash } from '../lib/create-hash';

const parser = unified().use(remarkParse as any);

export interface ShowroomRemarkCodeBlocksLoaderOptions {
  filter?: (code: MdCode) => boolean;
}

const showroomRemarkCodeblocksLoader: LoaderDefinition<ShowroomRemarkCodeBlocksLoaderOptions> =
  function (source, map, meta) {
    const cb = this.async();

    const options = this.getOptions();

    const tree = parser.parse(vFile(source));

    const blocks = codeblocks(tree as MdParent, {
      filter: options.filter,
    }).codeblocks;

    const result: CodeBlocks = {};

    async function transformCodes() {
      for (const language of Object.keys(blocks)) {
        const lang = language as SupportedLanguage;
        if (SUPPORTED_LANGUAGES.includes(lang)) {
          for (const code of blocks[language]) {
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
                initialCodeHash: createHash(code),
                lang,
              };
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    }

    transformCodes().finally(() => {
      cb(
        null,
        `module.exports = ${JSON.stringify(result)};`,
        map,
        meta
          ? {
              ...meta,
              ...result,
            }
          : (result as any)
      );
    });
  };

module.exports = showroomRemarkCodeblocksLoader;
