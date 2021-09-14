import { Environment } from '@showroomjs/core';
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
  getImportsAttach,
} from '../lib/generate-showroom-data';
import { getEnvVariables } from '../lib/get-env-variables';
import { logToStdout } from '../lib/log-to-stdout';
import { mergeWebpackConfig } from '../lib/merge-webpack-config';
import {
  moduleFileExtensions,
  resolveApp,
  resolveShowroom,
} from '../lib/paths';
import { rehypeCodeAutoId } from '../plugins/rehype-code-auto-id';
import { rehypeMetaAsAttribute } from '../plugins/rehype-meta-as-attribute';
import { rehypeMdxHeadings } from '../plugins/rehype-mdx-headings';
import VirtualModulesPlugin = require('webpack-virtual-modules');
const WebpackMessages = require('webpack-messages');

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

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: resolveShowroom('client-dist/index.js'),
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
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />${
                theme.resetCss
                  ? `<style>*,::after,::before{box-sizing:border-box}html{-moz-tab-size:4;tab-size:4}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'}hr{height:0;color:inherit}abbr[title]{text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}::-moz-focus-inner{border-style:none;padding:0}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}legend{padding:0}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}</style>`
                  : ''
              }<!--SSR-helmet-->
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

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: resolveShowroom('client-dist/prerender.js'),
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

  const virtualModules = new VirtualModulesPlugin({
    // create a virtual module that consists of parsed code blocks
    // so we can pregenerate during build time for better SSR
    [resolveShowroom('node_modules/react-showroom-codeblocks.js')]:
      generateCodeblocksData(components),
    // a virtual module that exports an `imports` that includes all the imports as configured in `imports` in config file.
    [resolveShowroom('node_modules/react-showroom-imports.js')]:
      getImportsAttach(imports),
    // a virtual module that consists of all the sections and component metadata.
    [resolveShowroom('node_modules/react-showroom-sections.js')]:
      generateSections(sections),
    [resolveShowroom('node_modules/react-showroom-wrapper.js')]:
      generateWrapper(wrapper),
  });

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
          options: docgen,
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          resourceQuery: /showroomCompile/,
          use: [
            {
              loader: require.resolve('esbuild-loader'),
              options: {
                loader: 'tsx',
                target: 'es2015',
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
                  options: {
                    imports,
                  },
                },
              ],
            },
            {
              resourceQuery: {
                not: [/showroomRaw/],
              },
              use: [
                {
                  loader: require.resolve('esbuild-loader'),
                  options: {
                    loader: 'tsx',
                    target: 'es2015',
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
        serverData: JSON.stringify(getEnvVariables(imports)),
        PRERENDER: String(options.prerender),
        MULTI_PAGES: String(prerenderConfig),
        BASE_PATH: isProd && basePath !== '/' ? basePath : '',
        REACT_SHOWROOM_THEME: JSON.stringify(theme),
      }),
      virtualModules,
    ],
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
