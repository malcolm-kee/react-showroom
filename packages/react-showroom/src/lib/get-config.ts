import {
  NormalizedReactShowroomConfiguration,
  ReactShowroomComponentSectionConfig,
  ReactShowroomConfiguration,
  ReactShowroomSectionConfig,
  ItemConfiguration,
} from '@showroomjs/core';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import slugify from 'slugify';
import { paths, resolveApp } from './paths';
import type { defineConfig } from '../index';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';

const DEFAULT_COMPONENTS_GLOB = 'src/components/**/*.{js,jsx,ts,tsx}';

const defaultConfig = {
  title: 'React Showroom',
  outDir: 'showroom',
  prerender: false,
  basePath: '/',
  codeTheme: nightOwlTheme,
};

let _normalizedConfig: NormalizedReactShowroomConfiguration;
export const getConfig = (): NormalizedReactShowroomConfiguration => {
  if (_normalizedConfig) {
    return _normalizedConfig;
  }

  const providedConfig = getUserConfig();

  const sections: Array<ReactShowroomSectionConfig> = [];
  const components: Array<ReactShowroomComponentSectionConfig> = [];

  if (!providedConfig.items) {
    const componentPaths = glob.sync(DEFAULT_COMPONENTS_GLOB, {
      cwd: paths.appPath,
      absolute: true,
    });

    collectComponents(componentPaths, sections, []);
  } else {
    collectSections(providedConfig.items, sections, []);
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
    basePath: providedConfig.basePath
      ? providedConfig.basePath === '/'
        ? '/'
        : removeTrailingSlash(providedConfig.basePath)
      : defaultConfig.basePath,
    assetDirs: providedConfig.assetDirs
      ? providedConfig.assetDirs.map((dir) => resolveApp(dir))
      : [],
  };

  return _normalizedConfig;

  function collectComponents(
    componentPaths: Array<string>,
    parent: Array<ReactShowroomSectionConfig>,
    parentSlugs: Array<string>
  ) {
    componentPaths.forEach((comPath) => {
      const comPathInfo = path.parse(comPath);
      const docPath = `${comPathInfo.dir}/${comPathInfo.name}.md`;

      const section: ReactShowroomComponentSectionConfig = {
        type: 'component',
        sourcePath: comPath,
        docPath: fs.existsSync(docPath) ? docPath : null,
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
    throw new Error(
      'Add a react-showroom.js file at the root of your project.'
    );
  }

  const provided: ReturnType<
    typeof defineConfig
  > = require(paths.appShowroomConfig);

  return typeof provided === 'function' ? provided() : provided;
};

const removeTrailingSlash = (path: string) => path.replace(/\/$/, '');
