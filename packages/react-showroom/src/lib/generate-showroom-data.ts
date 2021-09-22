import { getSafeName } from '@showroomjs/core';
import {
  ReactShowroomComponentSectionConfig,
  ReactShowroomSectionConfig,
} from '@showroomjs/core/react';

let _nameIndex = 0;
const getName = (name: string) => getSafeName(name) + '_' + _nameIndex++;

export const generateCodeblocksData = (
  sections: Array<ReactShowroomSectionConfig>
) => {
  const codeBlocksImportPaths: Array<string> = [];

  function collectCodeblocks(section: ReactShowroomSectionConfig) {
    switch (section.type) {
      case 'component':
        if (section.docPath) {
          codeBlocksImportPaths.push(
            `${section.docPath}?showroomRemarkCodeblocks`
          );
        }

        break;

      case 'markdown':
        codeBlocksImportPaths.push(
          `${section.sourcePath}?showroomRemarkDocCodeblocks`
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

  return `${codeBlocksImportPaths
    .map((path, index) => `import block${index} from '${path}';`)
    .join('\n')}
  export default {
        items: [
            ${codeBlocksImportPaths
              .map((_, index) => `block${index}`)
              .join(',')}
        ],
    }`;
};

const compileToComponentMetadata = (
  component: ReactShowroomComponentSectionConfig,
  imports: Array<ImportDefinition>
): string => {
  const name = getName('componentMetadata');

  imports.push({
    name,
    path: `${component.sourcePath}?showroomComponent`,
    type: 'default',
  });

  return name;
};

function compileComponentSection(
  component: ReactShowroomComponentSectionConfig,
  imports: Array<ImportDefinition>
): string {
  const { docPath } = component;

  const name = getName('componentSection');

  if (docPath) {
    imports.push(
      {
        name,
        type: 'default',
        path: docPath,
      },
      {
        name: `${name}_codeblocks`,
        type: 'default',
        path: `${docPath}?showroomRemarkCodeblocks`,
      },
      {
        name: `${name}_imports`,
        type: 'star',
        path: `${docPath}?showroomRemarkImports`,
      }
    );
  }

  return `{
      doc: ${docPath ? name : 'null'},
      codeblocks: ${docPath ? `${name}_codeblocks` : `{}`},
      component: ${compileToComponentMetadata(component, imports)},
      imports: ${docPath ? `${name}_imports.imports` : '{}'},
    }`;
}

interface ImportDefinition {
  type: 'star' | 'default';
  path: string;
  name: string;
}

export const generateSections = (
  sections: Array<ReactShowroomSectionConfig>
) => {
  const imports: Array<ImportDefinition> = [];

  function collect(sectionList: Array<ReactShowroomSectionConfig>): string {
    return `[${sectionList
      .map((section) => {
        if (section.type === 'group') {
          return `{
            type: 'group',
            title: '${section.title}',
            items: ${collect(section.items)},
            slug: '${section.slug}'
          }`;
        }

        if (section.type === 'component') {
          return `{
              type: 'component',
              data: ${compileComponentSection(section, imports)},
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
          const name = getName('markdown');

          imports.push(
            {
              type: 'star',
              name,
              path: section.sourcePath,
            },
            {
              type: 'star',
              name: `${name}_imports`,
              path: `${section.sourcePath}?showroomRemarkDocImports`,
            },
            {
              type: 'default',
              name: `${name}_codeblocks`,
              path: `${section.sourcePath}?showroomRemarkDocCodeblocks`,
            }
          );

          return `{
              type: 'markdown',
              Component: ${name}.default,
              title: ${name}.title || '${section.title || ''}',
              slug: '${section.slug}',
              frontmatter: ${name}.frontmatter || {},
              headings: ${name}.headings || [],
              imports: ${name}_imports.imports || {},
              codeblocks: ${name}_codeblocks || {}
            }`;
        }

        return JSON.stringify(section);
      })
      .join(', ')}].filter(el => !el.shouldIgnore)`;
  }

  const result = collect(sections);

  return `import slugify from 'slugify';
  ${imports
    .map((imp) =>
      imp.type === 'default'
        ? `import ${imp.name} from '${imp.path}';`
        : `import * as ${imp.name} from '${imp.path}';`
    )
    .join('\n')}
    export default ${result}`;
};

export const generateWrapper = (wrapper: string | undefined) => {
  if (wrapper) {
    return `import Wrapper from '${wrapper}?showroomCompile';
      export default Wrapper`;
  }

  return `import * as React from 'react';
    export default React.Fragment;`;
};
