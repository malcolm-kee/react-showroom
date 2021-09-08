import {
  NormalizedReactCompdocConfiguration,
  ReactCompdocComponentSectionConfig,
  ReactCompdocConfiguration,
  ReactCompdocSectionConfig,
  SectionConfiguration,
} from '@compdoc/core';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import slugify from 'slugify';
import { paths } from './paths';

const DEFAULT_COMPONENTS_GLOB = 'src/components/**/*.{js,jsx,ts,tsx}';

const defaultConfig = {
  title: 'React Compdoc',
  outDir: 'compdoc',
  prerender: false,
  basePath: '/',
};

let _normalizedConfig: NormalizedReactCompdocConfiguration;
export const getConfig = (): NormalizedReactCompdocConfiguration => {
  if (_normalizedConfig) {
    return _normalizedConfig;
  }

  const providedConfig = getUserConfig();

  const sections: Array<ReactCompdocSectionConfig> = [];
  const components: Array<ReactCompdocComponentSectionConfig> = [];

  if (
    !providedConfig.components &&
    !providedConfig.sections &&
    !providedConfig.docsFolder
  ) {
    const componentPaths = glob.sync(DEFAULT_COMPONENTS_GLOB, {
      cwd: paths.appPath,
      absolute: true,
    });

    collectComponents(componentPaths, sections, []);
  }

  if (providedConfig.components) {
    const componentPaths = glob.sync(providedConfig.components, {
      cwd: paths.appPath,
      absolute: true,
    });

    collectComponents(componentPaths, sections, []);
  }

  if (providedConfig.sections) {
    collectSections(providedConfig.sections, sections, []);
  }

  if (providedConfig.docsFolder) {
    const docsFolder = providedConfig.docsFolder;

    const pagesPaths = glob.sync(`${docsFolder}/**/*.{md,mdx}`, {
      cwd: paths.appPath,
    });

    pagesPaths.forEach((pagePath) => {
      const pathInfo = path.parse(pagePath);

      sections.push({
        type: 'markdown',
        sourcePath: path.resolve(paths.appPath, pagePath),
        slug: pathInfo.name === 'index' ? '' : pathInfo.name,
      });
    });
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
  };

  return _normalizedConfig;

  function collectComponents(
    componentPaths: Array<string>,
    parent: Array<ReactCompdocSectionConfig>,
    parentSlugs: Array<string>
  ) {
    componentPaths.forEach((comPath) => {
      const comPathInfo = path.parse(comPath);
      const docPath = `${comPathInfo.dir}/${comPathInfo.name}.mdx`;

      const section: ReactCompdocComponentSectionConfig = {
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
    sectionConfigs: Array<SectionConfiguration>,
    parent: Array<ReactCompdocSectionConfig>,
    parentSlugs: Array<string>
  ) {
    sectionConfigs.forEach((sectionConfig, sectionIndex) => {
      const docPath =
        sectionConfig.content &&
        path.resolve(paths.appPath, sectionConfig.content);

      if (sectionConfig.components || Array.isArray(sectionConfig.sections)) {
        const sectionTitle = sectionConfig.title || `Section ${sectionIndex}`;

        const slug = slugify(sectionTitle, { lower: true });

        const section: ReactCompdocSectionConfig = {
          type: 'group',
          title: sectionTitle,
          slug: parentSlugs.concat(slug).join('/'),
          items: [],
          docPath: docPath && fs.existsSync(docPath) ? docPath : null,
        };

        if (sectionConfig.components) {
          const componentPaths = glob.sync(sectionConfig.components, {
            cwd: paths.appPath,
            absolute: true,
          });

          collectComponents(
            componentPaths,
            section.items,
            parentSlugs.concat(slug)
          );
        }

        if (sectionConfig.sections) {
          collectSections(
            sectionConfig.sections,
            section.items,
            parentSlugs.concat(slug)
          );
        }

        parent.push(section);
      } else if (sectionConfig.href) {
        const linkSection: ReactCompdocSectionConfig = {
          type: 'link',
          href: sectionConfig.href,
          title: sectionConfig.title || sectionConfig.href,
        };
        parent.push(linkSection);
      } else if (docPath && fs.existsSync(docPath)) {
        const pathInfo = path.parse(docPath);

        parent.push({
          type: 'markdown',
          sourcePath: docPath,
          title: sectionConfig.title,
          slug: parentSlugs
            .concat(slugify(pathInfo.name, { lower: true }))
            .join('/'),
        });
      }
    });
  }
};

const getUserConfig = (): ReactCompdocConfiguration => {
  if (!fs.existsSync(paths.appCompdocConfig)) {
    throw new Error('Add a react-compdoc.js file at the root of your project.');
  }

  return require(paths.appCompdocConfig);
};

const removeTrailingSlash = (path: string) => path.replace(/\/$/, '');
