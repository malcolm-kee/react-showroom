import { dataToEsm } from '@rollup/pluginutils';
import fm from 'front-matter';
import fs from 'fs-extra';
import { Plugin } from 'vite';

export interface RollupPluginShowroomFrontmatterOptions {
  extensions?: Array<string>;
  resourceQuery: string;
}

export const RollupPluginShowroomFrontmatter = function ({
  extensions = ['md', 'mdx'],
  resourceQuery,
}: RollupPluginShowroomFrontmatterOptions): Plugin {
  const fileSpecs = extensions.map((ext) => ({
    ext,
    query: `?${resourceQuery}`,
    ending: `.${ext}?${resourceQuery}`,
  }));

  return {
    name: 'rollup-plugin-showroom-frontmatter',
    async load(id: string) {
      const match = fileSpecs.find((spec) => id.endsWith(spec.ending));

      if (match) {
        const source = await fs.readFile(
          id.slice(0, -match.query.length),
          'utf-8'
        );

        const { attributes } = fm(source);

        const h1match = h1Regex.exec(source);

        const title = h1match && h1match[1];

        return dataToEsm(Object.assign(title ? { title } : {}, attributes));
      }

      return null;
    },
  };
};

const h1Regex = /# (.*$)/im;
