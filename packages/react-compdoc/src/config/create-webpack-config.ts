import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { omit } from 'lodash';
import * as path from 'path';
import * as webpack from 'webpack';
import {
  generateCompdocData,
  getImportsAttach,
} from '../lib/generate-compdoc-data';
import { getClientImportMap } from '../lib/get-client-import-map';
import { getConfig } from '../lib/get-config';
import { mergeWebpackConfig } from '../lib/merge-webpack-config';
import { moduleFileExtensions, resolveApp, resolveCompdoc } from '../lib/paths';
import { rehypeMetaAsAttribute } from '../lib/rehype-meta-as-attribute';
import VirtualModulesPlugin = require('webpack-virtual-modules');

const userConfig = getConfig().webpackConfig;

export const createWebpackConfig = async (
  mode: 'development' | 'production',
  { outDir = 'compdoc' } = {}
): Promise<webpack.Configuration> => {
  const isProd = mode === 'production';

  const clientImportMap = getClientImportMap();

  const importAttach = getImportsAttach();

  const virtualModules = new VirtualModulesPlugin({
    // create a virtual module that consists of parsed component data and examples
    // so we can import it inside our client
    [resolveCompdoc('node_modules/react-compdoc-components.js')]:
      await generateCompdocData(),
    // a virtual module that imports the components provided by app and attach it to window object
    [resolveCompdoc('node_modules/react-compdoc-app-components.js')]:
      importAttach,
  });

  return mergeWebpackConfig(
    {
      mode,
      entry: resolveCompdoc('client-dist/index.js'),
      resolve: {
        extensions: moduleFileExtensions.map((ext) => `.${ext}`),
      },
      output: {
        path: resolveApp(outDir),
        publicPath: 'auto',
        assetModuleFilename: '[name]-[contenthash][ext][query]',
        clean: isProd,
      },
      module: {
        rules: [
          {
            test: /\.mdx?$/,
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
        isProd ? undefined : new ReactRefreshWebpackPlugin(),
        new webpack.EnvironmentPlugin({
          serverData: JSON.stringify({
            packages: Object.entries(clientImportMap).reduce(
              (result, [key, value]) => ({
                ...result,
                [key]: omit(value, ['path']),
              }),
              {}
            ),
          }),
        }),
        new HtmlWebpackPlugin({
          template: resolveCompdoc('public/index.html'),
        }),
        virtualModules,
      ].filter(isDefined),
      performance: {
        hints: false,
      },
      stats: 'none',
    },
    userConfig,
    mode
  );
};

const isDefined = <Value>(value: Value | undefined): value is Value =>
  typeof value !== 'undefined';
