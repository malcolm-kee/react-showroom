import { Environment } from '@compdoc/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import { rehypeMdxTitle } from 'rehype-mdx-title';
import remarkFrontmatter from 'remark-frontmatter';
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import {
  generateCodeblocksData,
  generateSections,
  getImportsAttach,
} from '../lib/generate-compdoc-data';
import { getConfig } from '../lib/get-config';
import { getEnvVariables } from '../lib/get-env-variables';
import { mergeWebpackConfig } from '../lib/merge-webpack-config';
import { moduleFileExtensions, resolveApp, resolveCompdoc } from '../lib/paths';
import { rehypeMetaAsAttribute } from '../lib/rehype-meta-as-attribute';
import VirtualModulesPlugin = require('webpack-virtual-modules');

const { webpackConfig: userConfig, title } = getConfig();

export const createWebpackConfig = (
  mode: Environment,
  { outDir = 'compdoc', prerender = false } = {}
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, { prerender });

  const isProd = mode === 'production';

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: resolveCompdoc('client-dist/index.js'),
      output: {
        path: resolveApp(outDir),
        publicPath: '/',
      },
      plugins: [
        isProd ? undefined : new ReactRefreshWebpackPlugin(),
        new HtmlWebpackPlugin({
          template: resolveCompdoc('public/index.html'),
          templateParameters: {
            title,
          },
          minify: isProd
            ? {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true,
                ignoreCustomComments: prerender ? [/SSR-/] : [],
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
              }
            : false,
        }),
      ].filter(isDefined),
    }),
    userConfig,
    mode
  );
};

export const createPrerenderWebpackConfig = (
  mode: Environment,
  { outDir = 'compdoc' } = {}
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, { prerender: true });

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: resolveCompdoc('client-dist/prerender.js'),
      output: {
        path: resolveApp(`${outDir}/server`),
        filename: 'prerender.js',
        library: {
          type: 'commonjs',
        },
      },
      externalsPresets: { node: true },
      target: 'node14.17',
    }),
    userConfig,
    mode
  );
};

const createBaseWebpackConfig = (
  mode: Environment,
  options: { prerender: boolean }
): webpack.Configuration => {
  const isProd = mode === 'production';

  const virtualModules = new VirtualModulesPlugin({
    // create a virtual module that consists of parsed code blocks
    // so we can pregenerate during build time for better SSR
    [resolveCompdoc('node_modules/react-compdoc-codeblocks.js')]:
      generateCodeblocksData(),
    // a virtual module that exports an `imports` that includes all the imports as configured in `imports` in config file.
    [resolveCompdoc('node_modules/react-compdoc-imports.js')]:
      getImportsAttach(),
    // a virtual module that consists of all the sections and component metadata.
    [resolveCompdoc('node_modules/react-compdoc-sections.js')]:
      generateSections(),
  });

  return {
    mode,
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    output: {
      assetModuleFilename: '[name]-[contenthash][ext][query]',
      clean: isProd,
    },
    module: {
      rules: [
        {
          test: /\.mdx?$/,
          oneOf: [
            {
              resourceQuery: /compdocRemark/,
              use: [
                {
                  loader: 'compdoc-remark-loader',
                },
              ],
            },
            {
              use: [
                {
                  loader: require.resolve('esbuild-loader'),
                  options: {
                    loader: 'jsx',
                    target: 'es2015',
                  },
                },
                {
                  loader: require.resolve('xdm/webpack.cjs'),
                  options: {
                    rehypePlugins: [rehypeMetaAsAttribute, rehypeMdxTitle],
                    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
                  },
                },
              ],
            },
          ],
        },
        {
          test: /\.wasm$/,
          type: 'asset/resource',
        },
      ],
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, '../loaders')],
    },
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    plugins: [
      new webpack.EnvironmentPlugin({
        serverData: JSON.stringify(getEnvVariables()),
        PRERENDER: String(options.prerender),
        PAGE_TITLE: title,
      }),
      virtualModules,
    ],
    performance: {
      hints: false,
    },
    stats: 'none',
  };
};

const isDefined = <Value>(value: Value | undefined): value is Value =>
  typeof value !== 'undefined';
