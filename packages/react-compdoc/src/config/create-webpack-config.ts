import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import {
  generateCompdocData,
  getImportsAttach,
} from '../lib/generate-compdoc-data';
import { getConfig } from '../lib/get-config';
import { getEnvVariables } from '../lib/get-env-variables';
import { mergeWebpackConfig } from '../lib/merge-webpack-config';
import { moduleFileExtensions, resolveApp, resolveCompdoc } from '../lib/paths';
import { rehypeMetaAsAttribute } from '../lib/rehype-meta-as-attribute';
import { Environment } from '../types';
import VirtualModulesPlugin = require('webpack-virtual-modules');

const userConfig = getConfig().webpackConfig;

export const createWebpackConfig = async (
  mode: Environment,
  { outDir = 'compdoc', prerender = false } = {}
): Promise<webpack.Configuration> => {
  const baseConfig = await createBaseWebpackConfig(mode, { prerender });

  const isProd = mode === 'production';

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: resolveCompdoc('client-dist/index.js'),
      output: {
        path: resolveApp(outDir),
        publicPath: 'auto',
      },
      plugins: [
        isProd ? undefined : new ReactRefreshWebpackPlugin(),
        new HtmlWebpackPlugin({
          template: resolveCompdoc('public/index.html'),
          minify: isProd
            ? {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true,
                ignoreCustomComments: [/SSR-/],
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

export const createPrerenderWebpackConfig = async (
  mode: Environment,
  { outDir = 'compdoc' } = {}
): Promise<webpack.Configuration> => {
  const baseConfig = await createBaseWebpackConfig(mode, { prerender: true });

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
      externals: [
        {
          react: 'react',
          'react-dom': 'react-dom',
          'react-dom/server': 'react-dom/server',
          'react-query': 'react-query',
          tslib: 'tslib',
          '@stitches/react': '@stitches/react',
        },
      ],
      target: 'node14.17',
    }),
    userConfig,
    mode
  );
};

const createBaseWebpackConfig = async (
  mode: Environment,
  options: { prerender: boolean }
): Promise<webpack.Configuration> => {
  const isProd = mode === 'production';

  const virtualModules = new VirtualModulesPlugin({
    // create a virtual module that consists of parsed component data and examples
    // so we can import it inside our client
    [resolveCompdoc('node_modules/react-compdoc-components.js')]:
      await generateCompdocData(),
    // a virtual module that exports an `imports` that includes all the imports as configured in `imports` in config file.
    [resolveCompdoc('node_modules/react-compdoc-imports.js')]:
      getImportsAttach(),
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
                    rehypePlugins: [rehypeMetaAsAttribute],
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
