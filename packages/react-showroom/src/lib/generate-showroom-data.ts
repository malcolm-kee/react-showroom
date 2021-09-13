import {
  ImportConfig,
  ReactShowroomComponentSectionConfig,
  ReactShowroomSectionConfig,
} from '@showroomjs/core/react';
import { getClientImportMap } from './get-client-import-map';

export const generateCodeblocksData = (
  components: Array<ReactShowroomComponentSectionConfig>
) => {
  return `module.exports = {
      items: [
          ${components
            .map(
              (comp) =>
                `{codeBlocks: ${
                  comp.docPath
                    ? `require('${comp.docPath}?showroomRemarkCodeblocks')`
                    : '{}'
                }}`
            )
            .join(',')}
      ],
  }`;
};

const compileToComponentMetadata = (
  component: ReactShowroomComponentSectionConfig
) => `require('showroom-loader?modules!${component.sourcePath}')`;

function compileComponentSection(
  component: ReactShowroomComponentSectionConfig
) {
  return `{
    doc: ${
      component.docPath ? `require('${component.docPath}').default` : 'null'
    },
    component: ${compileToComponentMetadata(component)},
  }`;
}

export const getImportsAttach = (
  importConfigs: Array<ImportConfig> | undefined
) => {
  const importMap = getClientImportMap(importConfigs);

  return `export const imports = {};
${Object.values(importMap)
  .map(({ varName, path }) => `import * as ${varName} from '${path}';`)
  .join('\n')}
  ${Object.values(importMap)
    .map(({ varName }) => `imports.${varName} = ${varName};`)
    .join('\n')}
`;
};

export const generateSections = (
  sections: Array<ReactShowroomSectionConfig>
) => {
  function mapSections(sectionList: Array<ReactShowroomSectionConfig>): string {
    return `[${sectionList
      .map((section) => {
        if (section.type === 'group') {
          return `{
          type: 'group',
          title: '${section.title}',
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
            headings: require('${section.sourcePath}').headings || [],
          }`;
        }

        return JSON.stringify(section);
      })
      .join(', ')}]`;
  }

  return `import slugify from 'slugify';
  export default ${mapSections(sections)};`;
};

export const generateWrapper = (wrapper: string | undefined) => {
  if (wrapper) {
    return `import Wrapper from '${wrapper}?showroomCompile';
    export default Wrapper`;
  }

  return `import * as React from 'react';
  export default React.Fragment;`;
};
