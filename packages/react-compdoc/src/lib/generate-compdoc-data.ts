import {
  ReactCompdocComponentSectionConfig,
  ReactCompdocSectionConfig,
} from '@compdoc/core';
import { getClientImportMap } from './get-client-import-map';
import { getConfig } from './get-config';

export const generateCodeblocksData = () => {
  const { components } = getConfig();

  return `module.exports = {
      items: [
          ${components
            .map(
              (comp) =>
                `{codeBlocks: ${
                  comp.docPath
                    ? `require('${comp.docPath}?compdocRemark')`
                    : '{}'
                }}`
            )
            .join(',')}
      ],
  }`;
};

const compileToComponentMetadata = (
  component: ReactCompdocComponentSectionConfig
) => `require('compdoc-loader?modules!${component.sourcePath}')`;

function compileComponentSection(
  component: ReactCompdocComponentSectionConfig
) {
  return `{
    doc: ${
      component.docPath ? `require('${component.docPath}').default` : 'null'
    },
    component: ${compileToComponentMetadata(component)},
  }`;
}

export const getImportsAttach = () => {
  const importMap = getClientImportMap();

  return `export const imports = {};
${Object.values(importMap)
  .map(({ varName, path }) => `import * as ${varName} from '${path}';`)
  .join('\n')}
  ${Object.values(importMap)
    .map(({ varName }) => `imports.${varName} = ${varName};`)
    .join('\n')}
`;
};

export const generateSections = () => {
  const { sections } = getConfig();

  function mapSections(sectionList: Array<ReactCompdocSectionConfig>): string {
    return `[${sectionList
      .map((section) => {
        if (section.type === 'group') {
          return `{
          type: 'group',
          title: '${section.title}',
          Component: ${
            section.docPath ? `require('${section.docPath}').default` : 'null'
          },
          items: ${mapSections(section.items)},
          slug: '${section.slug}'
        }`;
        }

        if (section.type === 'component') {
          return `{
            type: 'component',
            data: ${compileComponentSection(section)},
            get slug() {
              const parentSlugs = '${section.parentSlugs.join('/')}';

              return (parentSlugs && (parentSlugs + '/')) + slugify(this.data.component.slug, {lower: true})
            }
          }`;
        }

        if (section.type === 'markdown') {
          return `{
            type: 'markdown',
            Component: require('${section.sourcePath}').default,
            title: require('${section.sourcePath}').title || '${section.title}',
            slug: '${section.slug}',
            frontmatter: require('${section.sourcePath}').frontmatter || {},
          }`;
        }

        return JSON.stringify(section);
      })
      .join(', ')}]`;
  }

  return `import slugify from 'slugify';
  export default ${mapSections(sections)};`;
};
