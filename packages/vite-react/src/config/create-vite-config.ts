import virtual from '@rollup/plugin-virtual';
import { Environment, isString } from '@showroomjs/core';
import { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react-vite';
import { rehypeMdxTitle } from 'rehype-mdx-title';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter';
import { UserConfig } from 'vite';
import {
  generateCodeblocksData,
  generateSections,
  generateWrapper,
} from '../lib/generate-showroom-data';
import { paths } from '../lib/paths';
import { rehypeCodeAutoId } from '../plugins/rehype-code-auto-id';
import { rehypeMdxHeadings } from '../plugins/rehype-mdx-headings';
import { rehypeMetaAsAttribute } from '../plugins/rehype-meta-as-attribute';
import {
  RollupPluginShowroomCodeblocks,
  RollupPluginShowroomCodeblocksOptions,
} from '../rollup-plugin/rollup-plugin-showroom-codeblocks';
import { RollupPluginShowroomComponent } from '../rollup-plugin/rollup-plugin-showroom-component';
import { RollupPluginShowroomCodeblocksImports } from '../rollup-plugin/rollup-plugin-showroom-codeblocks-imports';
import path from 'path';

const { getXdm } = require(path.resolve(__dirname, '../../esm-bridge/get-xdm'));

const defaultConfig = {
  css: {
    postcss: paths.appPath,
  },
};

export const createViteConfig = async (
  env: Environment,
  config: NormalizedReactShowroomConfiguration
): Promise<UserConfig> => {
  const isProd = env === 'production';

  const codeBlocksOptions: RollupPluginShowroomCodeblocksOptions = {
    resourceQuery: 'showroomRemarkCodeblocks',
    filter: (code) => !isString(code.meta) || !code.meta.includes('static'),
  };

  const docsCodeBlocksOptions: RollupPluginShowroomCodeblocksOptions = {
    resourceQuery: 'showroomRemarkDocCodeblocks',
    filter: (code) => isString(code.meta) && code.meta.includes('live'),
  };

  const xdm = (await getXdm()) as typeof import('xdm/rollup');

  return {
    ...defaultConfig,
    root: paths.showroomPath,
    publicDir: config.assetDir || false,
    base: `${config.basePath}/`,
    logLevel: 'info',
    css: config.css || defaultConfig.css,
    define: {
      'process.env.MULTI_PAGES': String(config.prerender),
      'process.env.BASE_PATH': `'${isProd ? config.basePath : ''}'`,
      'process.env.REACT_SHOWROOM_THEME': JSON.stringify(config.theme),
      global: '{}',
    },
    plugins: [
      virtual({
        'react-showroom-codeblocks': generateCodeblocksData(config.sections),
        'react-showroom-sections': generateSections(config.sections),
        'react-showroom-wrapper': generateWrapper(config.wrapper),
      }),
      xdm.default({
        rehypePlugins: [
          rehypeSlug,
          rehypeMetaAsAttribute,
          rehypeMdxTitle,
          rehypeCodeAutoId,
          rehypeMdxHeadings,
        ],
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
        ],
      }),
      RollupPluginShowroomComponent({
        resourceQuery: 'showroomComponent',
        docgenConfig: config.docgen,
      }),
      RollupPluginShowroomCodeblocks(codeBlocksOptions),
      RollupPluginShowroomCodeblocks(docsCodeBlocksOptions),
      RollupPluginShowroomCodeblocksImports({
        ...codeBlocksOptions,
        resourceQuery: 'showroomRemarkImports',
        imports: config.imports,
      }),
      RollupPluginShowroomCodeblocksImports({
        ...docsCodeBlocksOptions,
        resourceQuery: 'showroomRemarkDocImports',
        imports: config.imports,
      }),
    ],
  };
};
