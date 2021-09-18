import { Environment, isString } from '@showroomjs/core';
import { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import { rehypeMdxTitle } from 'rehype-mdx-title';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import {
  generateCodeblocksData,
  generateSections,
  generateWrapper,
} from '../lib/generate-showroom-data';
import { logToStdout } from '../lib/log-to-stdout';
import { mergeWebpackConfig } from '../lib/merge-webpack-config';
import {
  moduleFileExtensions,
  resolveApp,
  resolveShowroom,
} from '../lib/paths';
import { rehypeCodeAutoId } from '../plugins/rehype-code-auto-id';
import { rehypeMdxHeadings } from '../plugins/rehype-mdx-headings';
import { rehypeMetaAsAttribute } from '../plugins/rehype-meta-as-attribute';
import { createBabelPreset } from './create-babel-preset';
import VirtualModulesPlugin = require('webpack-virtual-modules');
import type { ShowroomRemarkCodeBlocksLoaderOptions } from '../loaders/showroom-remark-codeblocks-loader';
const WebpackMessages = require('webpack-messages');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

export const createWebpackConfig = (
  mode: Environment,
  config: NormalizedReactShowroomConfiguration,
  { outDir = 'showroom', prerender = false } = {}
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, config, { prerender });

  const {
    webpackConfig: userConfig,
    prerender: prerenderConfig,
    assetDirs,
    basePath,
    theme,
  } = config;

  const isProd = mode === 'production';

  const clientEntry = resolveShowroom('client-dist/index.js');

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: config.require ? config.require.concat(clientEntry) : clientEntry,
      output: {
        path: resolveApp(outDir),
        publicPath: prerenderConfig
          ? basePath === '/' || !isProd
            ? '/'
            : `${basePath}/` // need to add trailing slash
          : 'auto',
      },
      optimization: {
        minimize: isProd,
      },
      plugins: [
        new HtmlWebpackPlugin({
          templateContent: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" /><!--SSR-helmet-->${
                theme.resetCss
                  ? `<style>*,::after,::before{box-sizing:border-box}html{-moz-tab-size:4;tab-size:4}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'}hr{height:0;color:inherit}abbr[title]{text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}::-moz-focus-inner{border-style:none;padding:0}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}legend{padding:0}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}</style>`
                  : ''
              }
              <style>
                html,
                body,
                #target {
                  height: 100%;
                }
              </style>
              <!--SSR-style-->
            </head>
            <body>
              <div id="target"><!--SSR-target--></div>
            </body>
          </html>`,
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
        new WebpackMessages({
          name: 'showroom',
          logger: logToStdout,
        }),
        isProd && assetDirs.length > 0
          ? new CopyWebpackPlugin({
              patterns: assetDirs.map((dir) => ({
                from: path.posix.join(dir.replace(/\\/g, '/'), '**/*'),
                to: resolveApp(outDir),
                context: dir,
                globOptions: {
                  ignore: ['**/*.html'],
                },
              })),
            })
          : undefined,
      ].filter(isDefined),
    }),
    userConfig,
    mode
  );
};

export const createPrerenderWebpackConfig = (
  mode: Environment,
  config: NormalizedReactShowroomConfiguration,
  { outDir = 'showroom' } = {}
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, config, { prerender: true });

  const clientEntry = resolveShowroom('client-dist/prerender.js');

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: config.require ? config.require.concat(clientEntry) : clientEntry,
      output: {
        path: resolveApp(`${outDir}/server`),
        filename: 'prerender.js',
        library: {
          type: 'commonjs',
        },
      },
      externalsPresets: { node: true },
      target: 'node14.17',
      plugins: [
        new WebpackMessages({
          name: 'prerender',
          logger: logToStdout,
        }),
      ],
    }),
    config.webpackConfig,
    mode
  );
};

const createBaseWebpackConfig = (
  mode: Environment,
  {
    prerender: prerenderConfig,
    basePath,
    theme,
    components,
    sections,
    imports,
    wrapper,
    docgen,
    debug,
  }: NormalizedReactShowroomConfiguration,
  options: { prerender: boolean }
): webpack.Configuration => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const virtualModules = new VirtualModulesPlugin({
    // create a virtual module that consists of parsed code blocks
    // so we can pregenerate during build time for better SSR
    [resolveShowroom('node_modules/react-showroom-codeblocks.js')]:
      generateCodeblocksData(components),
    // a virtual module that consists of all the sections and component metadata.
    [resolveShowroom('node_modules/react-showroom-sections.js')]:
      generateSections(sections),
    [resolveShowroom('node_modules/react-showroom-wrapper.js')]:
      generateWrapper(wrapper),
  });

  const babelPreset = createBabelPreset(mode);

  const codeBlocksOptions: ShowroomRemarkCodeBlocksLoaderOptions = {
    filter: (code) => !isString(code.meta) || !code.meta.includes('static'),
  };

  const docsCodeBlocksOptions: ShowroomRemarkCodeBlocksLoaderOptions = {
    filter: (code) => isString(code.meta) && code.meta.includes('live'),
  };

  return {
    mode,
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    output: {
      filename: isProd ? 'assets/js/[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProd
        ? 'assets/js/[name].[contenthash:8].js'
        : '[name].js',
      assetModuleFilename: 'assets/media/[name]-[contenthash][ext][query]',
      clean: isProd,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          resourceQuery: /showroomComponent/,
          loader: 'showroom-component-loader',
          options: {
            ...docgen,
            debug,
          },
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          resourceQuery: /showroomCompile/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [() => babelPreset],
                plugins: isDev
                  ? [require.resolve('react-refresh/babel')]
                  : undefined,
                babelrc: false,
                configFile: false,
              },
            },
          ],
        },
        {
          test: /\.mdx?$/,
          oneOf: [
            {
              resourceQuery: /showroomRemarkCodeblocks/,
              use: [
                {
                  loader: 'showroom-remark-codeblocks-loader',
                  options: codeBlocksOptions,
                },
              ],
            },
            {
              resourceQuery: /showroomRemarkDocCodeblocks/,
              use: [
                {
                  loader: 'showroom-remark-codeblocks-loader',
                  options: docsCodeBlocksOptions,
                },
              ],
            },
            {
              resourceQuery: /showroomRemarkImports/,
              use: [
                {
                  loader: 'showroom-remark-codeblocks-imports-loader',
                  options: {
                    imports,
                  },
                },
                {
                  loader: 'showroom-remark-codeblocks-loader',
                  options: codeBlocksOptions,
                },
              ],
            },
            {
              resourceQuery: /showroomRemarkDocImports/,
              use: [
                {
                  loader: 'showroom-remark-codeblocks-imports-loader',
                  options: {
                    imports,
                  },
                },
                {
                  loader: 'showroom-remark-codeblocks-loader',
                  options: docsCodeBlocksOptions,
                },
              ],
            },
            {
              resourceQuery: {
                not: [/showroomRaw/],
              },
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: [() => babelPreset],
                    plugins: isProd
                      ? undefined
                      : [require.resolve('react-refresh/babel')],
                    babelrc: false,
                    configFile: false,
                  },
                },
                {
                  loader: require.resolve('xdm/webpack.cjs'),
                  options: {
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
                    ],
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
        {
          resourceQuery: /showroomRaw/,
          type: 'asset/source',
        },
      ],
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, '../loaders')],
    },
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    plugins: [
      new webpack.EnvironmentPlugin({
        PRERENDER: String(options.prerender),
        MULTI_PAGES: String(prerenderConfig),
        BASE_PATH: isProd && basePath !== '/' ? basePath : '',
        REACT_SHOWROOM_THEME: JSON.stringify(theme),
      }),
      virtualModules,
      isDev ? new ReactRefreshWebpackPlugin() : undefined,
    ].filter(isDefined),
    performance: {
      hints: false,
    },
    infrastructureLogging: {
      level: debug ? 'info' : isProd ? 'info' : 'none',
    },
    stats: debug ? 'normal' : 'none',
  };
};

const isDefined = <Value>(value: Value | undefined): value is Value =>
  typeof value !== 'undefined';
