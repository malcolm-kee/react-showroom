import virtual from '@rollup/plugin-virtual';
import { Environment, isString } from '@showroomjs/core';
import { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import path from 'path';
import * as docgen from 'react-docgen-typescript';
import { rehypeMdxTitle } from 'rehype-mdx-title';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter';
import type { Plugin, UserConfig as ViteConfig } from 'vite';
import { searchForWorkspaceRoot } from 'vite';
import {
  generateCodeblocksData,
  generateSections,
  generateWrapper,
} from '../lib/generate-showroom-data';
import { paths, resolveApp, resolveShowroom } from '../lib/paths';
import { requireToModule } from '../lib/require-to-module';
import { rehypeCodeAutoId } from '../plugins/rehype-code-auto-id';
import { rehypeMdxHeadings } from '../plugins/rehype-mdx-headings';
import { rehypeMetaAsAttribute } from '../plugins/rehype-meta-as-attribute';
import {
  RollupPluginShowroomCodeblocks,
  RollupPluginShowroomCodeblocksOptions,
} from '../rollup-plugin/rollup-plugin-showroom-codeblocks';
import { RollupPluginShowroomCodeblocksImports } from '../rollup-plugin/rollup-plugin-showroom-codeblocks-imports';
import { RollupPluginShowroomComponent } from '../rollup-plugin/rollup-plugin-showroom-component';
import { RollupPluginShowroomFrontmatter } from '../rollup-plugin/rollup-plugin-showroom-frontmatter';

const { getXdm } = require(path.resolve(__dirname, '../../esm-bridge/get-xdm'));

const defaultConfig = {
  css: {
    postcss: paths.appPath,
  },
};

export interface CreateViteConfigOptions {
  ssr?: {
    outDir: string;
  };
}

export const createViteConfig = async (
  env: Environment,
  config: NormalizedReactShowroomConfiguration,
  { ssr }: CreateViteConfigOptions = {}
): Promise<ViteConfig> => {
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

  const docgenParser = docgen.withCustomConfig(
    config.docgen.tsconfigPath,
    config.docgen.options
  );

  return {
    ...defaultConfig,
    root: paths.showroomPath,
    publicDir: config.assetDir || false,
    base: `${config.basePath}/`,
    css: config.css || defaultConfig.css,
    logLevel: 'warn',
    define: {
      'process.env.PRERENDER': isProd ? String(config.prerender) : 'false',
      'process.env.BASE_PATH': `'${config.basePath}'`,
      'process.env.IS_SPA': String(!config.prerender),
      'process.env.REACT_SHOWROOM_THEME': JSON.stringify(config.theme),
      'process.env.NODE_ENV': `'${env}'`,
    },
    resolve: config.resolve,
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd()), paths.showroomPath],
      },
    },
    build: {
      outDir: ssr ? ssr.outDir : resolveApp(config.outDir),
      assetsDir: '_assets',
      emptyOutDir: true,
      manifest: true,
      ...(ssr
        ? {
            ssr: true,
            rollupOptions: {
              input: resolveShowroom('client/server-entry.tsx'),
            },
          }
        : {
            rollupOptions: {
              input: isProd
                ? resolveShowroom('client/ssr-client-entry.tsx')
                : resolveShowroom('client/client-entry.tsx'),
            },
          }),
    },
    plugins: [
      virtual({
        'react-showroom-codeblocks': generateCodeblocksData(config.sections),
        'react-showroom-sections': generateSections(
          config.sections,
          paths.showroomPath,
          docgenParser
        ),
        'react-showroom-wrapper': generateWrapper(config.wrapper),
        'react-showroom-require': requireToModule(config.require),
      }) as Plugin,
      xdm.default({
        rehypePlugins: [
          rehypeSlug as any,
          rehypeMetaAsAttribute,
          rehypeMdxTitle,
          rehypeCodeAutoId,
          rehypeMdxHeadings,
        ],
        remarkPlugins: [
          remarkFrontmatter as any,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
        ],
      }) as Plugin,
      RollupPluginShowroomComponent({
        resourceQuery: 'showroomComponent',
        docgenParser,
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
      RollupPluginShowroomFrontmatter({
        resourceQuery: 'showroomFrontmatter',
      }),
    ],
  };
};
