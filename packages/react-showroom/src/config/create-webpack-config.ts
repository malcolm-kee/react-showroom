import { Environment, isDefined, isString } from '@showroomjs/core';
import { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin';
import * as path from 'path';
import * as docgen from 'react-docgen-typescript';
import { rehypeMdxTitle } from 'rehype-mdx-title';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import { createHash } from '../lib/create-hash';
import {
  generateAllComponents,
  generateCodeblocksData,
  generateSectionsAndImports,
  generateWrapper,
} from '../lib/generate-showroom-data';
import { logToStdout } from '../lib/log-to-stdout';
import { mergeWebpackConfig } from '../lib/merge-webpack-config';
import {
  moduleFileExtensions,
  paths,
  resolveApp,
  resolveShowroom,
} from '../lib/paths';
import { pkgData } from '../lib/pkg-data';
import { rehypeCodeAutoId } from '../plugins/rehype-code-auto-id';
import { rehypeMdxHeadings } from '../plugins/rehype-mdx-headings';
import { rehypeMetaAsAttribute } from '../plugins/rehype-meta-as-attribute';
import type { ShowroomRemarkCodeBlocksLoaderOptions } from '../webpack-loader/showroom-remark-codeblocks-loader';
import { createBabelPreset } from './create-babel-preset';
import VirtualModulesPlugin = require('webpack-virtual-modules');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WebpackMessages = require('webpack-messages');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

export const createWebpackConfig = (
  mode: Environment,
  config: NormalizedReactShowroomConfiguration,
  { outDir = 'showroom' } = {}
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, config, { ssr: false });

  const {
    webpackConfig: userConfig,
    prerender: prerenderConfig,
    assetDir,
    basePath,
    theme,
    html,
  } = config;

  const isProd = mode === 'production';

  const clientEntry = resolveShowroom(
    'client-dist/app/showroom-client-entry.js'
  );
  const previewEntry = resolveShowroom(
    'client-dist/app/preview-client-entry.js'
  );

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: {
        showroom: config.require
          ? config.require.concat(clientEntry)
          : clientEntry,
        preview: config.require
          ? config.require.concat(previewEntry)
          : previewEntry,
      },
      output: {
        path: resolveApp(outDir),
        publicPath: !isProd ? '/' : `${basePath}/`, // need to add trailing slash
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: resolveShowroom('html-template/showroom.html'),
          templateParameters: {
            favicon: theme.favicon,
            resetCss: theme.resetCss,
          },
          minify: isProd && {
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeComments: true,
            ignoreCustomComments: [/SSR-/],
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
          chunks: ['showroom'],
        }),
        html.showroom
          ? new HtmlWebpackTagsPlugin({
              ...html.showroom,
              files: ['**/index.html'],
            })
          : undefined,
        new HtmlWebpackPlugin({
          filename: '_preview.html',
          template: resolveShowroom('html-template/preview.html'),
          templateParameters: {
            title: theme.title,
            resetCss: theme.resetCss,
            prerender: mode === 'production' && !!prerenderConfig,
          },
          minify: isProd && {
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeComments: true,
            ignoreCustomComments: [/SSR-/],
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
          chunks: ['preview'],
        }),
        html.preview
          ? new HtmlWebpackTagsPlugin({
              ...html.preview,
              files: ['**/_preview.html'],
            })
          : undefined,
        new WebpackMessages({
          name: 'showroom',
          logger: logToStdout,
        }),
        isProd && assetDir
          ? new CopyWebpackPlugin({
              patterns: [
                {
                  from: path.posix.join(assetDir.replace(/\\/g, '/'), '**/*'),
                  to: resolveApp(outDir),
                  context: assetDir,
                  globOptions: {
                    ignore: ['**/*.html'],
                  },
                },
              ],
            })
          : undefined,
      ].filter(isDefined),
    }),
    userConfig,
    mode
  );
};

export const createSsrWebpackConfig = (
  mode: Environment,
  config: NormalizedReactShowroomConfiguration,
  { outDir = 'showroom' } = {}
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, config, { ssr: true });

  const showroomServer = resolveShowroom(
    'client-dist/app/showroom-server-entry.js'
  );
  const previewServer = resolveShowroom(
    'client-dist/app/preview-server-entry.js'
  );

  return mergeWebpackConfig(
    merge(baseConfig, {
      entry: {
        ...(config.require ? { requireConfig: config.require } : {}),
        prerender: showroomServer,
        previewPrerender: previewServer,
      },
      output: {
        path: resolveApp(`${outDir}/server`),
        filename: '[name].js',
        library: {
          type: 'commonjs',
        },
      },
      externalsPresets: { node: true },
      target: 'node14.17',
      plugins: [
        new WebpackMessages({
          name: 'ssr',
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
  config: NormalizedReactShowroomConfiguration,
  options: { ssr: boolean }
): webpack.Configuration => {
  const {
    prerender: prerenderConfig,
    css,
    url,
    basePath,
    theme,
    sections,
    imports,
    wrapper,
    docgen: docgenConfig,
    debug,
    cacheDir,
    example: exampleConfig,
  } = config;

  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const docgenParser = docgen.withCustomConfig(
    docgenConfig.tsconfigPath,
    docgenConfig.options
  );

  const generated = generateSectionsAndImports(sections, paths.showroomPath);

  const virtualModules = new VirtualModulesPlugin({
    // create a virtual module that consists of parsed code blocks
    // so we can pregenerate during build time for better SSR
    [resolveShowroom('node_modules/react-showroom-codeblocks.js')]:
      generateCodeblocksData(sections),
    // a virtual module that consists of all the sections and component metadata.
    [resolveShowroom('node_modules/react-showroom-sections.js')]:
      generated.sections,
    [resolveShowroom('node_modules/react-showroom-wrapper.js')]:
      generateWrapper(wrapper),
    [resolveShowroom('node_modules/react-showroom-all-imports.js')]:
      generated.allImports,
    [resolveShowroom('node_modules/react-showroom-all-components.js')]:
      generateAllComponents(sections),
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
      filename: isProd ? '_assets/js/[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProd
        ? '_assets/js/[name].[contenthash:8].js'
        : '[name].js',
      assetModuleFilename: '_assets/media/[name]-[contenthash][ext][query]',
      clean: isProd,
    },
    module: {
      rules: [
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
          test: /\.(ts|tsx)$/,
          resourceQuery: {
            not: [/raw/],
          },
          oneOf: [
            {
              resourceQuery: /showroomComponentMetadata/,
              loader: 'showroom-component-metadata-loader',
              options: {
                docgenParser,
                debug,
              },
            },
            {
              resourceQuery: /showroomComponent/,
              loader: 'showroom-component-loader',
              options: {
                docgenParser,
                debug,
              },
            },
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [() => babelPreset],
                plugins: isDev
                  ? [require.resolve('react-refresh/babel')]
                  : undefined,
              },
            },
          ],
        },
        {
          test: /\.mdx?$/,
          oneOf: [
            {
              resourceQuery: /showroomFrontmatter/,
              use: [
                {
                  loader: 'showroom-frontmatter-loader',
                },
              ],
            },
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
                not: [/raw/],
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
                      remarkGfm,
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
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        css.enabled
          ? {
              test: /\.css$/,
              sideEffects: true,
              use: [
                isProd
                  ? MiniCssExtractPlugin.loader
                  : require.resolve('style-loader'),
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: css.usePostcss ? 1 : 0,
                    modules: {
                      auto: true,
                      localIdentName: isProd
                        ? '[hash:base64]'
                        : '[path][name]__[local]',
                    },
                  },
                },
                css.usePostcss
                  ? {
                      loader: require.resolve('postcss-loader'),
                      options: {
                        sourceMap: isProd,
                        postcssOptions: {
                          config: paths.appPostcssConfig,
                        },
                      },
                    }
                  : undefined,
              ].filter(isDefined),
            }
          : undefined,
      ].filter(isDefined),
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, '../webpack-loader')],
    },
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    cache: cacheDir
      ? {
          type: 'filesystem',
          name: `react-showroom-${mode}-${
            prerenderConfig ? (options.ssr ? 'ssr' : 'client') : 'spa'
          }`,
          version: [
            pkgData.version,
            createHash(
              JSON.stringify(config, (_, value) =>
                typeof value === 'function' ? String(value) : value
              )
            ),
          ].join('-'),
          buildDependencies: {
            config: [__filename, paths.appShowroomConfig],
            ...(css.usePostcss
              ? {
                  css: [paths.appPostcssConfig],
                }
              : {}),
          },
          cacheDirectory: cacheDir,
        }
      : undefined,
    plugins: [
      isProd
        ? new MiniCssExtractPlugin({
            filename: '_assets/css/[name].[contenthash].css',
            chunkFilename: '_assets/css/[name].[contenthash].css',
          })
        : undefined,
      new webpack.EnvironmentPlugin({
        PRERENDER: isProd,
        SSR: options.ssr,
        BASE_PATH: isProd ? basePath : '',
        PRERENDER_EXAMPLE: !!prerenderConfig,
        REACT_SHOWROOM_THEME: theme,
        NODE_ENV: mode,
        EXAMPLE_WIDTHS: exampleConfig.widths,
        SITE_URL: url,
      }),
      virtualModules,
      isDev ? new ReactRefreshWebpackPlugin() : undefined,
      isProd
        ? new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 1000,
          })
        : undefined,
    ].filter(isDefined),
    optimization: {
      minimize: !options.ssr && isProd,
      minimizer: [
        '...', // keep existing minimizer
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
      },
    },
    performance: {
      hints: false,
    },
    infrastructureLogging: {
      level: debug ? 'info' : isProd ? 'info' : 'none',
    },
    stats: debug ? 'normal' : 'none',
  };
};
