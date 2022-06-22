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
import { createDocParser } from '../lib/create-doc-parser';
import { createHash } from '../lib/create-hash';
import {
  generateAllComponents,
  generateAllComponentsDocs,
  generateAllComponentsPaths,
  generateCodeblocksData,
  generateDocPlaceHolder,
  generateSearchIndex,
  generateSectionsAndImports,
  generateWrapper,
  generateReactEntryCompat,
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

export const createClientWebpackConfig = (
  mode: Environment,
  config: NormalizedReactShowroomConfiguration,
  {
    outDir = 'showroom',
    profileWebpack = false,
    measure = false,
    operation,
  }: {
    outDir?: string;
    profileWebpack?: boolean;
    measure?: boolean;
    operation: 'build' | 'serve';
  } = {
    operation: 'build',
  }
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, config, {
    ssr: false,
    profile: profileWebpack,
    measure,
    operation,
  });

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
      externals: ['crypto'],
      output: {
        path: resolveApp(outDir),
        publicPath: `${basePath}/`, // need to add trailing slash
      },
      plugins: [
        // workaround as html-webpack-plugin not compatible with ProfilingPlugin. See https://github.com/jantimon/html-webpack-plugin/issues/1652.
        ...(profileWebpack
          ? []
          : [
              new HtmlWebpackPlugin({
                template: resolveShowroom('html-template/showroom.html'),
                templateParameters: {
                  favicon: theme.favicon,
                  resetCss: theme.resetCss,
                  backgroundColor: theme.colors['primary-800'],
                  linkManifest: theme.manifest && isProd,
                  basePath,
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
                inject: false,
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
                inject: false,
                chunks: ['preview'],
              }),
              html.preview
                ? new HtmlWebpackTagsPlugin({
                    ...html.preview,
                    files: ['**/_preview.html'],
                  })
                : undefined,
            ]),
        measure
          ? undefined // don't prettify output message when measuring to avoid important info get cleared
          : new WebpackMessages({
              name: 'showroom',
              logger: logToStdout,
            }),
        operation === 'build' && assetDir
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
        theme.serviceWorker && operation === 'build'
          ? new (require('workbox-webpack-plugin').InjectManifest)({
              swSrc: resolveShowroom(
                'client/service-worker/_showroom-service-worker.ts'
              ),
              exclude: [/.wasm$/, /.map$/, /.html$/],
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
  { outDir = 'showroom', profileWebpack = false, measure = false } = {}
): webpack.Configuration => {
  const baseConfig = createBaseWebpackConfig(mode, config, {
    ssr: true,
    profile: profileWebpack,
    measure,
    operation: 'build',
  });

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
      plugins: measure
        ? [] // don't prettify output message when measuring to avoid important info get cleared
        : [
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
  options: {
    ssr: boolean;
    profile: boolean;
    measure: boolean;
    operation: 'build' | 'serve';
  }
): webpack.Configuration => {
  const {
    prerender: prerenderConfig,
    css,
    sass,
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
    componentsEntry,
    search,
    compilerOptions,
  } = config;

  const isBuild = options.operation === 'build';
  const isServe = options.operation === 'serve';
  const isProd = mode === 'production';

  const componentTypeParser = docgen.withCustomConfig(
    docgenConfig.tsconfigPath,
    {
      shouldRemoveUndefinedFromOptional: true,
    }
  );

  const docParser = createDocParser({
    tsconfigPath: docgenConfig.tsconfigPath,
    parserOptions: docgenConfig.options,
  });

  const generated = generateSectionsAndImports(sections, {
    skipEmptyComponent: config.skipEmptyComponent,
    enableAdvancedEditor: exampleConfig.enableAdvancedEditor,
  });

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
    [resolveShowroom('node_modules/react-showroom-all-components-docs.js')]:
      generateAllComponentsDocs(sections),
    [resolveShowroom('node_modules/react-showroom-comp-metadata.js')]:
      generateAllComponentsPaths(sections),
    [resolveShowroom('node_modules/react-showroom-doc-placeholder.js')]:
      generateDocPlaceHolder(exampleConfig.placeholder),
    [resolveShowroom('node_modules/react-showroom-index.js')]:
      generateSearchIndex(sections, search.includeHeadings),
    [resolveShowroom('node_modules/react-showroom-compat.js')]:
      generateReactEntryCompat(),
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
      filename: isBuild ? '_assets/js/[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isBuild
        ? '_assets/js/[name].[contenthash:8].js'
        : '[name].js',
      assetModuleFilename: '_assets/media/[name]-[contenthash][ext][query]',
      clean: isBuild,
    },
    module: {
      rules: [
        {
          test: /.js$/,
          resourceQuery: /showroomCompProp/,
          use: [
            {
              loader: 'showroom-all-component-prop-loader',
              options: {
                parse: (sources: Array<string>) =>
                  componentTypeParser.parse(sources).map((doc) =>
                    Object.assign({}, doc, {
                      id: createHash(doc.filePath),
                    })
                  ),
                dts:
                  exampleConfig.enableAdvancedEditor &&
                  componentsEntry &&
                  (isDefined(componentsEntry.dts)
                    ? isString(componentsEntry.dts)
                      ? path.resolve(paths.appPath, componentsEntry.dts)
                      : componentsEntry.dts
                    : path.resolve(
                        cacheDir,
                        'dts',
                        `${path.parse(componentsEntry.path).name}.d.ts`
                      )),
                debug,
              },
            },
          ],
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          resourceQuery: /showroomCompile/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [() => babelPreset],
                plugins: isServe
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
          resourceQuery: /docgen/,
          use: [
            {
              loader: 'showroom-docgen-typescript-loader',
              options: {
                parser: docParser,
                debug,
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          resourceQuery: {
            not: [/raw/, /docgen/],
          },
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [() => babelPreset],
                plugins: isServe
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
              resourceQuery: /headings/,
              use: [
                {
                  loader: 'showroom-remark-headings-loader',
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
            exampleConfig.enableAdvancedEditor
              ? {
                  resourceQuery: /showroomRemarkImportsDts/,
                  use: [
                    {
                      loader: 'showroom-remark-codeblocks-dts-loader',
                      options: {
                        imports,
                      },
                    },
                    {
                      loader: 'showroom-remark-codeblocks-loader',
                      options: codeBlocksOptions,
                    },
                  ],
                }
              : undefined,
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
            exampleConfig.enableAdvancedEditor
              ? {
                  resourceQuery: /showroomRemarkDocImportsDts/,
                  use: [
                    {
                      loader: 'showroom-remark-codeblocks-dts-loader',
                      options: {
                        imports,
                      },
                    },
                    {
                      loader: 'showroom-remark-codeblocks-loader',
                      options: docsCodeBlocksOptions,
                    },
                  ],
                }
              : undefined,
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
                    plugins: isBuild
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
          ].filter(isDefined),
        },
        {
          test: /\.wasm$/,
          type: 'asset/resource',
        },
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          test: /\.css$/,
          // if app don't need CSS, we still need to handle css in @showroomjs/device-frames
          ...(css.enabled
            ? {}
            : {
                include: [/node_modules\/@showroomjs\/device-frames/],
              }),
          sideEffects: true,
          use: [
            isBuild
              ? {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    emit: !options.ssr,
                  },
                }
              : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: css.usePostcss ? 1 : 0,
                modules: {
                  auto: true,
                  localIdentName: isBuild
                    ? '[hash:base64]'
                    : '[path][name]__[local]',
                },
              },
            },
            css.usePostcss
              ? {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    sourceMap: isBuild,
                    postcssOptions: {
                      config: paths.appPostcssConfig,
                    },
                  },
                }
              : undefined,
          ].filter(isDefined),
        },
        sass
          ? {
              test: /\.s[ac]ss$/i,
              sideEffects: true,
              use: [
                isBuild
                  ? {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        emit: !options.ssr,
                      },
                    }
                  : require.resolve('style-loader'),
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: {
                      auto: true,
                      localIdentName: isBuild
                        ? '[hash:base64]'
                        : '[path][name]__[local]',
                    },
                  },
                },
                require.resolve('sass-loader'),
              ],
            }
          : undefined,
      ].filter(isDefined),
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, '../webpack-loader')],
    },
    devtool: isBuild ? 'source-map' : 'cheap-module-source-map',
    cache: cacheDir
      ? {
          type: 'filesystem',
          name: `react-showroom-${mode}-${options.ssr ? 'ssr' : 'client'}${
            prerenderConfig ? '-prerender' : ''
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
      isBuild
        ? new MiniCssExtractPlugin({
            filename: '_assets/css/[name].[contenthash].css',
            chunkFilename: '_assets/css/[name].[contenthash].css',
          })
        : undefined,
      new webpack.EnvironmentPlugin({
        PRERENDER: isBuild,
        SSR: options.ssr,
        BASE_PATH: basePath,
        PRERENDER_EXAMPLE: !!prerenderConfig,
        REACT_SHOWROOM_THEME: theme,
        NODE_ENV: mode,
        EXAMPLE_DIMENSIONS: exampleConfig.dimensions,
        ENABLE_ADVANCED_EDITOR: exampleConfig.enableAdvancedEditor,
        SYNC_STATE_TYPE: exampleConfig.syncStateType,
        SHOW_DEVICE_FRAME: exampleConfig.showDeviceFrame,
        A11Y_CONFIG: exampleConfig.a11y.config,
        SITE_URL: url,
        AUDIENCE_TOGGLE: theme.audienceToggle,
        COMPONENTS_ENTRY_NAME: (componentsEntry && componentsEntry.name) || '',
        COMPILER_OPTIONS: compilerOptions,
        USE_SW: theme.serviceWorker,
      }),
      virtualModules,
      isServe
        ? new ReactRefreshWebpackPlugin({
            overlay: false,
          })
        : undefined,
      options.profile
        ? new webpack.debug.ProfilingPlugin({
            outputPath: resolveApp(
              `showroom-webpack-profile${options.ssr ? '-ssr' : ''}.json`
            ),
          })
        : undefined,
      isProd
        ? new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 1000,
          })
        : undefined,
      options.measure
        ? new (require('speed-measure-webpack-plugin'))()
        : undefined,
    ].filter(isDefined),
    optimization: {
      minimize: !options.ssr && isProd,
      minimizer: options.measure
        ? undefined
        : [
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
      level: debug || isProd ? 'info' : 'none',
    },
    stats: debug ? 'normal' : 'none',
    experiments: {
      backCompat: false, // may improve performance, see https://www.tines.com/blog/understanding-why-our-build-got-15x-slower-with-webpack-5
    },
  };
};
