// @ts-ignore
import { dataToEsm } from '@rollup/pluginutils';
import fs from 'fs';
import type { Code as MdCode } from 'mdast';
import { mdToCodeBlocks } from '../lib/codeblocks';

export interface RollupPluginShowroomCodeblocksOptions {
  extensions?: Array<string>;
  resourceQuery: string;
  filter?: (code: MdCode) => boolean;
}

export const RollupPluginShowroomCodeblocks = function ({
  extensions = ['md', 'mdx'],
  resourceQuery,
  filter,
}: RollupPluginShowroomCodeblocksOptions) {
  const fileSpecs = extensions.map((ext) => ({
    ext,
    query: `?${resourceQuery}`,
    ending: `.${ext}?${resourceQuery}`,
  }));

  return {
    name: 'rollup-plugin-showroom-codeblocks',
    load(id: string) {
      const match = fileSpecs.find((spec) => id.endsWith(spec.ending));
      if (match) {
        const oriPath = id.slice(0, -match.query.length);
        return dataToEsm(
          mdToCodeBlocks(fs.readFileSync(oriPath, 'utf-8'), filter)
        );
      }
      return null;
    },
  };
};
