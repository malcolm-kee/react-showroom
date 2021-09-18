import {
  ReactShowroomComponentSectionConfig,
  ReactShowroomSectionConfig,
} from '@showroomjs/core/react';

export const generateCodeblocksData = (
  sections: Array<ReactShowroomSectionConfig>
) => {
  const codeBlocksStatements: Array<string> = [];

  function collectCodeblocks(section: ReactShowroomSectionConfig) {
    switch (section.type) {
      case 'component':
        if (section.docPath) {
          codeBlocksStatements.push(
            `require('${section.docPath}?showroomRemarkCodeblocks')`
          );
        }

        break;

      case 'markdown':
        codeBlocksStatements.push(
          `require('${section.sourcePath}?showroomRemarkDocCodeblocks')`
        );

        break;

      case 'group':
        section.items.forEach(collectCodeblocks);
        break;

      default:
        break;
    }
  }

  sections.forEach(collectCodeblocks);

  return `module.exports = {
      items: [
          ${codeBlocksStatements
            .map((statement) => `{ codeBlocks: ${statement} }`)
            .join(',')}
      ],
  }`;
};

const compileToComponentMetadata = (
  component: ReactShowroomComponentSectionConfig
) => `require('${component.sourcePath}?showroomComponent')`;

function compileComponentSection(
  component: ReactShowroomComponentSectionConfig
) {
  const { docPath } = component;

  return `{
    doc: ${docPath ? `require('${docPath}').default` : 'null'},
    codeblocks: ${
      docPath ? `require('${docPath}?showroomRemarkCodeblocks')` : `{}`
    },
    component: ${compileToComponentMetadata(component)},
    imports: ${
      component.docPath
        ? `require('${component.docPath}?showroomRemarkImports').imports`
        : '{}'
    },
  }`;
}

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
            },
            get shouldIgnore() {
              return !this.data.component.Component;
            }
          }`;
          // because the component parsing may return nothing, so need to set a flag here and filter it at bottom
        }

        if (section.type === 'markdown') {
          return `{
            type: 'markdown',
            Component: require('${section.sourcePath}').default,
            title: require('${section.sourcePath}').title || '${section.title}',
            slug: '${section.slug}',
            frontmatter: require('${section.sourcePath}').frontmatter || {},
            headings: require('${section.sourcePath}').headings || [],
            imports: require('${section.sourcePath}?showroomRemarkDocImports').imports || {},
            codeblocks: require('${section.sourcePath}?showroomRemarkDocCodeblocks') || {}
          }`;
        }

        return JSON.stringify(section);
      })
      .join(', ')}].filter(el => !el.shouldIgnore)`;
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
