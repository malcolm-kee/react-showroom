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
};

let _normalizedConfig: NormalizedReactCompdocConfiguration;
export const getConfig = (): NormalizedReactCompdocConfiguration => {
  if (_normalizedConfig) {
    return _normalizedConfig;
  }

  const providedConfig = getUserConfig();

  const sections: Array<ReactCompdocSectionConfig> = [];
  const components: Array<ReactCompdocComponentSectionConfig> = [];

  if (!providedConfig.components && !providedConfig.sections) {
    const componentPaths = glob.sync(DEFAULT_COMPONENTS_GLOB, {
      cwd: paths.appPath,
      absolute: true,
    });

    collectComponents(componentPaths);
  }

  if (providedConfig.components) {
    const componentPaths = glob.sync(providedConfig.components, {
      cwd: paths.appPath,
      absolute: true,
    });

    collectComponents(componentPaths);
  }

  if (providedConfig.sections) {
    collectSections(providedConfig.sections);
  }

  _normalizedConfig = {
    ...defaultConfig,
    ...providedConfig,
    sections,
    components,
  };

  return _normalizedConfig;

  function collectComponents(
    componentPaths: Array<string>,
    parent = sections,
    parentSlugs: Array<string> = []
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
    parent = sections,
    parentSlugs: Array<string> = []
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
          slug,
          items: [],
          docPath: docPath && fs.existsSync(docPath) ? docPath : null,
          parentSlugs,
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
        parent.push({
          type: 'markdown',
          sourcePath: docPath,
          title: sectionConfig.title,
          parentSlugs,
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
