import { flattenArray, isString } from '@showroomjs/core';
import {
  ItemConfiguration,
  NormalizedReactShowroomConfiguration,
  ReactShowroomComponentSectionConfig,
  ReactShowroomConfiguration,
  ReactShowroomSectionConfig,
  ThemeConfiguration,
} from '@showroomjs/core/react';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import type { ParserOptions } from 'react-docgen-typescript';
import slugify from 'slugify';
import type webpack from 'webpack';
import type { defineConfig } from '../index';
import { logToStdout } from './log-to-stdout';
import { paths, resolveApp } from './paths';

const DEFAULT_COMPONENTS_GLOB = 'src/components/**/*.{ts,tsx}';

const defaultConfig = {
  basePath: '/',
  codeTheme: nightOwlTheme,
  resetCss: true,
};

const defaultDocgenOptions: ParserOptions = {
  propFilter: (prop) => {
    if (prop.parent) {
      return !prop.parent.fileName.includes('@types/react');
    }
    return true;
  },
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true,
  shouldRemoveUndefinedFromOptional: true,
};

const defaultThemeConfiguration: ThemeConfiguration = {
  title: 'React Showroom',
  codeTheme: nightOwlTheme,
  resetCss: true,
  navbar: {},
  colors: {
    'primary-50': '#FDF2F8',
    'primary-100': '#FCE7F3',
    'primary-200': '#FBCFE8',
    'primary-300': '#F9A8D4',
    'primary-400': '#F472B6',
    'primary-500': '#EC4899',
    'primary-600': '#DB2777',
    'primary-700': '#BE185D',
    'primary-800': '#9D174D',
    'primary-900': '#831843',
  },
};

let _normalizedConfig: NormalizedReactShowroomConfiguration;
export const getConfig = (
  userConfig?: ReactShowroomConfiguration
): NormalizedReactShowroomConfiguration => {
  if (_normalizedConfig) {
    return _normalizedConfig;
  }

  const {
    build: providedBuildConfig = {},
    devServer: providedDevServerConfig = {},
    components: providedComponentGlob,
    items,
    webpackConfig,
    docgen: providedDocgenConfig = {},
    theme: providedThemeConfig = {},
    imports: providedImports,
    ...providedConfig
  } = userConfig || getUserConfig();

  const sections: Array<ReactShowroomSectionConfig> = [];
  const components: Array<ReactShowroomComponentSectionConfig> = [];

  if (providedComponentGlob) {
    const componentPaths = glob.sync(providedComponentGlob, {
      cwd: paths.appPath,
      absolute: true,
    });

    collectComponents(componentPaths, sections, []);
  } else if (!items) {
    const componentPaths = glob.sync(DEFAULT_COMPONENTS_GLOB, {
      cwd: paths.appPath,
      absolute: true,
    });

    collectComponents(componentPaths, sections, []);
  }

  if (items) {
    collectSections(items, sections, []);
  }

  if (!sections.some((section) => 'slug' in section && section.slug === '')) {
    // use README.md as home page if no home page
    const readmePath = path.resolve(paths.appPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      sections.push({
        type: 'markdown',
        sourcePath: readmePath,
        slug: '',
      });
    }
  }

  _normalizedConfig = {
    ...defaultConfig,
    ...providedConfig,
    webpackConfig: webpackConfig || getUserWebpackConfig(),
    sections,
    components,
    basePath: providedBuildConfig.basePath
      ? providedBuildConfig.basePath === '/'
        ? '/'
        : removeTrailingSlash(providedBuildConfig.basePath)
      : defaultConfig.basePath,
    assetDirs: providedConfig.assetDirs
      ? providedConfig.assetDirs.map((dir) => resolveApp(dir))
      : [],
    wrapper: providedConfig.wrapper && resolveApp(providedConfig.wrapper),
    outDir: providedBuildConfig.outDir || 'showroom',
    prerender: providedBuildConfig.prerender || false,
    devServerPort: providedDevServerConfig.port || 6969,
    docgen: {
      tsconfigPath: providedDocgenConfig.tsconfigPath || paths.appTsConfig,
      options: {
        ...defaultDocgenOptions,
        ...(providedDocgenConfig.options || {}),
      },
    },
    theme: {
      ...defaultThemeConfiguration,
      ...providedThemeConfig,
    },
    imports: providedImports
      ? providedImports.some((imp) =>
          isString(imp) ? imp === 'react' : imp.name === 'react'
        )
        ? providedImports
        : providedImports.concat('react')
      : ['react'],
  };

  return _normalizedConfig;

  function collectComponents(
    componentPaths: Array<string>,
    parent: Array<ReactShowroomSectionConfig>,
    parentSlugs: Array<string>
  ) {
    componentPaths.forEach((comPath) => {
      const comPathInfo = path.parse(comPath);

      let docPath: string | null = null;

      for (const ext of COMPONENT_DOC_EXTENSIONS) {
        const possibleDocPath = `${comPathInfo.dir}/${comPathInfo.name}${ext}`;

        if (fs.existsSync(possibleDocPath)) {
          docPath = possibleDocPath;
          break;
        }
      }

      const section: ReactShowroomComponentSectionConfig = {
        type: 'component',
        sourcePath: comPath,
        docPath,
        parentSlugs,
      };

      components.push(section);
      parent.push(section);
    });
  }

  function collectSections(
    sectionConfigs: Array<ItemConfiguration>,
    parent: Array<ReactShowroomSectionConfig>,
    parentSlugs: Array<string>
  ) {
    sectionConfigs.forEach((sectionConfig, sectionIndex) => {
      switch (sectionConfig.type) {
        case 'group': {
          const title = sectionConfig.title;

          if (!title) {
            // if no title, this is a empty group, so delegate to parent
            collectSections(
              sectionConfig.items,
              parent,
              sectionConfig.path
                ? parentSlugs.concat(sectionConfig.path)
                : parentSlugs
            );
            return;
          }

          const slug = sectionConfig.path || slugify(title, { lower: true });

          const section: ReactShowroomSectionConfig = {
            type: 'group',
            title,
            slug: parentSlugs.concat(slug).join('/'),
            items: [],
          };

          collectSections(
            sectionConfig.items,
            section.items,
            parentSlugs.concat(slug)
          );

          parent.push(section);
          return;
        }

        case 'components': {
          const title = sectionConfig.title;

          const componentPaths = Array.isArray(sectionConfig.components)
            ? flattenArray(
                sectionConfig.components.map((pattern) =>
                  glob.sync(pattern, {
                    cwd: paths.appPath,
                    absolute: true,
                  })
                )
              )
            : glob.sync(sectionConfig.components, {
                cwd: paths.appPath,
                absolute: true,
              });

          if (componentPaths.length === 0) {
            return;
          }

          if (!title) {
            collectComponents(
              componentPaths,
              parent,
              sectionConfig.path
                ? parentSlugs.concat(sectionConfig.path)
                : parentSlugs
            );
            return;
          }

          const slug = sectionConfig.path || slugify(title, { lower: true });

          const section: ReactShowroomSectionConfig = {
            type: 'group',
            title,
            slug: parentSlugs.concat(slug).join('/'),
            items: [],
          };

          collectComponents(
            componentPaths,
            section.items,
            parentSlugs.concat(slug)
          );
          parent.push(section);

          return;
        }

        case 'content': {
          const docPath = path.resolve(paths.appPath, sectionConfig.content);
          if (!fs.existsSync(docPath)) {
            return;
          }

          const slug = isString(sectionConfig.path)
            ? sectionConfig.path
            : (sectionConfig.title &&
                slugify(sectionConfig.title, { lower: true })) ||
              path.parse(docPath).name;

          parent.push({
            type: 'markdown',
            title: sectionConfig.title,
            sourcePath: docPath,
            slug: parentSlugs.concat(slug).join('/'),
          });
          return;
        }

        case 'link': {
          parent.push(sectionConfig);
          return;
        }

        case 'docs': {
          const docsFolder = sectionConfig.folder;

          const pagesPaths = glob.sync(`${docsFolder}/**/*.{md,mdx}`, {
            cwd: paths.appPath,
          });

          pagesPaths.forEach((pagePath) => {
            const pathInfo = path.parse(pagePath);

            const slug = pathInfo.name === 'index' ? '' : pathInfo.name;

            parent.push({
              type: 'markdown',
              sourcePath: path.resolve(paths.appPath, pagePath),
              slug: parentSlugs.concat(slug).join('/'),
            });
          });
          return;
        }

        default:
          return;
      }
    });
  }
};

const getUserConfig = (): ReactShowroomConfiguration => {
  if (!fs.existsSync(paths.appShowroomConfig)) {
    return {};
  }

  const provided: ReturnType<
    typeof defineConfig
  > = require(paths.appShowroomConfig);

  return typeof provided === 'function' ? provided() : provided;
};

const removeTrailingSlash = (path: string) => path.replace(/\/$/, '');

const COMPONENT_DOC_EXTENSIONS = ['.mdx', '.md'] as const;

const getUserWebpackConfig = (): webpack.Configuration | undefined => {
  const rootWebpackConfigPath = resolveApp('webpack.config.js');

  if (fs.existsSync(rootWebpackConfigPath)) {
    logToStdout(`Using webpack config at ${rootWebpackConfigPath}.`);
    return require(rootWebpackConfigPath);
  }

  return undefined;
};
