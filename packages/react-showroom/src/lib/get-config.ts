import {
  ItemConfiguration,
  NormalizedReactShowroomConfiguration,
  ReactShowroomComponentSectionConfig,
  ReactShowroomConfiguration,
  ReactShowroomSectionConfig,
} from '@showroomjs/core/react';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import slugify from 'slugify';
import type { defineConfig } from '../index';
import { paths, resolveApp } from './paths';

const DEFAULT_COMPONENTS_GLOB = 'src/components/**/*.{ts,tsx}';

const defaultConfig = {
  title: 'React Showroom',
  basePath: '/',
  codeTheme: nightOwlTheme,
  resetCss: true,
};

let _normalizedConfig: NormalizedReactShowroomConfiguration;
export const getConfig = (): NormalizedReactShowroomConfiguration => {
  if (_normalizedConfig) {
    return _normalizedConfig;
  }

  const {
    build: providedBuildConfig = {},
    devServer: providedDevServerConfig = {},
    components: providedComponentGlob,
    items,
    ...providedConfig
  } = getUserConfig();

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

      // const docPath = `${comPathInfo.dir}/${comPathInfo.name}.md`;
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
        // docPath: fs.existsSync(docPath) ? docPath : null,
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

          const componentPaths = glob.sync(sectionConfig.components, {
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

          const slug =
            sectionConfig.path ||
            (sectionConfig.title &&
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
