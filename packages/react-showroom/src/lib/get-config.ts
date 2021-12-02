import {
  Environment,
  flattenArray,
  isString,
  removeTrailingSlash,
} from '@showroomjs/core';
import {
  ImportConfig,
  ItemConfiguration,
  NormalizedReactShowroomConfiguration,
  ReactShowroomComponentSectionConfig,
  ReactShowroomConfiguration,
  ReactShowroomSectionConfig,
  ThemeConfiguration,
} from '@showroomjs/core/react';
import * as fs from 'fs';
import * as glob from 'glob';
import { yellow } from 'nanocolors';
import * as path from 'path';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import type { ParserOptions } from 'react-docgen-typescript';
import slugify from 'slugify';
import type { defineConfig } from '../index';
import { createHash } from './create-hash';
import { logToStdout } from './log-to-stdout';
import { paths, resolveApp } from './paths';
import * as ts from 'typescript';

const DEFAULT_COMPONENTS_GLOB = 'src/components/**/*.tsx';
const DEFAULT_IGNORES = [
  '**/__tests__/**',
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
  '**/*.d.ts',
];

const defaultConfig = {
  basePath: '',
  url: '',
  codeTheme: nightOwlTheme,
  resetCss: true,
  outDir: 'showroom',
};

const docgenOptions: ParserOptions = {
  propFilter: (prop) => {
    if (prop.parent) {
      return !prop.parent.fileName.includes('@types/react');
    }
    return true;
  },
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true,
  shouldRemoveUndefinedFromOptional: true,
  shouldIncludePropTagMap: true,
};

const defaultThemeConfiguration: ThemeConfiguration = {
  title: 'React Showroom',
  codeTheme: nightOwlTheme,
  resetCss: true,
  audienceToggle: 'design',
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
  env: Environment,
  configFile?: string,
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
    docgen: providedDocgenConfig = {},
    theme: providedThemeConfig = {},
    imports: providedImports,
    ignores = DEFAULT_IGNORES,
    cacheDir = '.showroom_cache',
    componentsEntry,
    css = {
      postcss: fs.existsSync(paths.appPostcssConfig),
    },
    example: { widths = [320, 768, 1024], placeholder } = {},
    html = {},
    ...providedConfig
  } = userConfig || getUserConfig(env, configFile);

  const sections: Array<ReactShowroomSectionConfig> = [];
  const components: Array<ReactShowroomComponentSectionConfig> = [];

  if (providedComponentGlob) {
    const componentPaths = glob.sync(providedComponentGlob, {
      cwd: paths.appPath,
      absolute: true,
      ignore: ignores,
    });

    collectComponents(componentPaths, sections, [], false);
  } else if (!items) {
    const componentPaths = glob.sync(DEFAULT_COMPONENTS_GLOB, {
      cwd: paths.appPath,
      absolute: true,
      ignore: ignores,
    });

    collectComponents(componentPaths, sections, [], false);
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
        formatLabel: (x) => x,
      });
    }
  }

  const { outDir = 'showroom', prerender = true } = providedBuildConfig;

  const imports: Array<ImportConfig> = providedImports
    ? providedImports.some((imp) => imp === 'react')
      ? providedImports
      : providedImports.concat('react')
    : ['react'];

  const tsconfigPath = providedDocgenConfig.tsconfigPath || paths.appTsConfig;

  const { config } = ts.readConfigFile(tsconfigPath, (path) =>
    fs.readFileSync(path, 'utf8')
  );

  _normalizedConfig = {
    ...defaultConfig,
    ...providedConfig,
    componentsEntry,
    example: {
      widths,
      placeholder: placeholder && resolveApp(placeholder),
    },
    html,
    css: {
      enabled: !!css,
      usePostcss: !!(css && css.postcss),
    },
    ignores,
    sections,
    basePath: providedBuildConfig.basePath
      ? removeTrailingSlash(providedBuildConfig.basePath)
      : defaultConfig.basePath,
    assetDir: providedConfig.assetDir && resolveApp(providedConfig.assetDir),
    wrapper: providedConfig.wrapper && resolveApp(providedConfig.wrapper),
    cacheDir: cacheDir ? resolveApp(cacheDir) : null,
    outDir,
    prerender,
    devServerPort: providedDevServerConfig.port || 6969,
    docgen: {
      tsconfigPath,
      options: docgenOptions,
    },
    theme: {
      ...defaultThemeConfiguration,
      ...providedThemeConfig,
    },
    imports: componentsEntry ? imports.concat(componentsEntry) : imports,
    compilerOptions: (config && config.compilerOptions) || {},
  };

  return _normalizedConfig;

  function collectComponents(
    componentPaths: Array<string>,
    parent: Array<ReactShowroomSectionConfig>,
    parentSlugs: Array<string>,
    hideFromSidebar: boolean | undefined
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
        id: createHash(comPath),
        hideFromSidebar,
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
    sectionConfigs.forEach((sectionConfig) => {
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

          if (slug.startsWith('_')) {
            logToStdout(
              yellow(
                'Having path starts with _ may causes unexpected behavior.'
              )
            );
            logToStdout(`Path is "${slug}" for ${title}`);
          }

          const section: ReactShowroomSectionConfig = {
            type: 'group',
            title,
            slug: parentSlugs.concat(slug).join('/'),
            hideFromSidebar: sectionConfig.hideFromSidebar,
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
                    ignore: ignores,
                  })
                )
              )
            : glob.sync(sectionConfig.components, {
                cwd: paths.appPath,
                absolute: true,
                ignore: ignores,
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
                : parentSlugs,
              sectionConfig.hideFromSidebar
            );
            return;
          }

          const slug = sectionConfig.path || slugify(title, { lower: true });

          if (slug.startsWith('_')) {
            logToStdout(
              yellow(
                'Having path starts with _ may causes unexpected behavior.'
              )
            );
            logToStdout(`Path is "${slug}" for ${title}`);
          }

          const section: ReactShowroomSectionConfig = {
            type: 'group',
            title,
            slug: parentSlugs.concat(slug).join('/'),
            items: [],
            hideFromSidebar: sectionConfig.hideFromSidebar,
          };

          collectComponents(
            componentPaths,
            section.items,
            parentSlugs.concat(slug),
            sectionConfig.hideFromSidebar
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

          if (slug.startsWith('_')) {
            logToStdout(
              yellow(
                'Having path starts with _ may causes unexpected behavior.'
              )
            );
            logToStdout(`Path is "${slug}" for ${sectionConfig.content}`);
          }

          parent.push({
            type: 'markdown',
            title: sectionConfig.title,
            sourcePath: docPath,
            slug: parentSlugs.concat(slug).join('/'),
            hideFromSidebar: sectionConfig.hideFromSidebar,
            formatLabel: (x) => x,
            _associatedComponentName: sectionConfig._associatedComponentName,
          });
          return;
        }

        case 'link': {
          parent.push(sectionConfig);
          return;
        }

        case 'docs': {
          const docsFolder = sectionConfig.folder;
          const docGroupTitle = sectionConfig.title;
          const formatLabel = sectionConfig.formatLabel || ((x: string) => x);

          const pagesPaths = glob.sync(`${docsFolder}/**/*.{md,mdx}`, {
            cwd: paths.appPath,
            ignore: sectionConfig.ignores,
          });

          if (docGroupTitle) {
            const docPathPrefix =
              sectionConfig.path || slugify(docGroupTitle, { lower: true });
            const slugParts = parentSlugs.concat(docPathPrefix);
            const section: ReactShowroomSectionConfig = {
              type: 'group',
              title: docGroupTitle,
              slug: slugParts.join('/'),
              items: [],
              hideFromSidebar: sectionConfig.hideFromSidebar,
            };

            collectDocs(section.items, slugParts, formatLabel);

            parent.push(section);
          } else {
            collectDocs(parent, parentSlugs, formatLabel);
          }

          function collectDocs(
            targetItems: Array<ReactShowroomSectionConfig>,
            pathToDoc: Array<string>,
            formatLabel: (ori: string) => string
          ) {
            pagesPaths.forEach((pagePath) => {
              const pathInfo = path.parse(pagePath);

              const slug = pathInfo.name === 'index' ? '' : pathInfo.name;

              if (slug.startsWith('_')) {
                logToStdout(
                  yellow(
                    'Having path starts with _ may causes unexpected behavior.'
                  )
                );
                logToStdout(`Path is "${slug}" for ${pagePath}`);
              }

              targetItems.push({
                type: 'markdown',
                sourcePath: path.resolve(paths.appPath, pagePath),
                slug: pathToDoc.concat(slug).join('/'),
                formatLabel,
              });
            });
          }

          return;
        }

        default:
          return;
      }
    });
  }
};

const getUserConfig = (
  env: Environment,
  configFile?: string
): ReactShowroomConfiguration => {
  const configFilePath = configFile
    ? resolveApp(configFile)
    : paths.appShowroomConfig;

  if (!fs.existsSync(configFilePath)) {
    return {};
  }

  const provided: ReturnType<typeof defineConfig> = require(configFilePath);

  return typeof provided === 'function'
    ? provided(env === 'development' ? 'dev' : 'build')
    : provided;
};

const COMPONENT_DOC_EXTENSIONS = ['.mdx', '.md'] as const;
