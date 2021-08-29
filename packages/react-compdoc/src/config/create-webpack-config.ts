import * as webpack from 'webpack';
import { moduleFileExtensions, resolveApp, resolveCompdoc } from '../lib/paths';
import VirtualModulesPlugin = require('webpack-virtual-modules');
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { createBabelConfig } from './babel-config';
import { generateCompdocData } from '../lib/generate-compdoc-data';

export const createWebpackConfig = (
  mode: 'development' | 'production',
  { outDir = 'compdoc' } = {}
): webpack.Configuration => {
  const isProd = mode === 'production';

  const babelConfig = createBabelConfig(mode);

  // create a virtual module that consists of parsed component data and examples
  // so we can import it inside our client
  const virtualModules = new VirtualModulesPlugin({
    [resolveCompdoc('node_modules/react-compdoc-components.js')]:
      generateCompdocData(),
  });

  return {
    mode,
    entry: resolveCompdoc('client/index.tsx'),
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    output: {
      path: resolveApp(outDir),
      publicPath: 'auto',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: resolveCompdoc('client'),
          loader: require.resolve('babel-loader'),
          options: {
            presets: [() => babelConfig],
            babelrc: false,
            configFile: false,
          },
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: resolveApp('src'),
          loader: require.resolve('babel-loader'),
          options: {
            presets: [() => babelConfig],
            babelrc: false,
            configFile: false,
          },
        },
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [() => babelConfig],
                babelrc: false,
                configFile: false,
              },
            },
            {
              loader: require.resolve('@mdx-js/loader'),
            },
          ],
        },
        {
          test: /\.wasm$/,
          type: 'asset/resource',
        },
      ],
    },
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: resolveCompdoc('client/index.html'),
      }),
      virtualModules,
    ],
  };
};
