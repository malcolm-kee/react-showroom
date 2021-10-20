import { getSafeName } from '@showroomjs/core';
import {
  ReactShowroomComponentSectionConfig,
  ReactShowroomSectionConfig,
} from '@showroomjs/core/react';
import path from 'path';
import { ComponentDoc, FileParser } from 'react-docgen-typescript';
import slugify from 'slugify';

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

function compileComponentSection(
  component: ReactShowroomComponentSectionConfig,
  componentDoc: ComponentDoc,
  rootDir: string
): string {
  const { docPath, sourcePath } = component;

  const load = docPath
    ? `async () => {
  const loadDoc = import(/* webpackChunkName: "${componentDoc.displayName}-doc" */'${docPath}');
  const loadImports = import(/* webpackChunkName: "${componentDoc.displayName}-imports" */'${docPath}?showroomRemarkImports');
  const loadCodeBlocks = import(/* webpackChunkName: "${componentDoc.displayName}-codeblocks" */'${docPath}?showroomRemarkCodeblocks');

  return {
    doc: (await loadDoc).default,
    metadata: (await import(/* webpackChunkName: "${componentDoc.displayName}-metadata" */'${sourcePath}?showroomComponent')).default,
    imports: (await loadImports).imports || {},
    codeblocks: (await loadCodeBlocks).default || {},
  }    
}`
    : `async () => ({
  metadata: (await import(/* webpackChunkName: "${
    componentDoc ? componentDoc.displayName : ''
  }-metadata" */'${sourcePath}?showroomComponent')).default,
  doc: null,
  imports: {},
  codeblocks: {},
})`;

  return `{
      preloadUrl: ${docPath ? `'${path.relative(rootDir, docPath)}'` : 'null'},
      load: ${load},
    }`;
}

interface ImportDefinition {
  type: 'star' | 'default';
  path: string;
  name: string;
}

export const generateSectionsAndImports = (
  sections: Array<ReactShowroomSectionConfig>,
  rootDir: string,
  docgenParser: FileParser
) => {
  const imports: Array<ImportDefinition> = [];
  const codeImportImports: Array<{
    path: string;
    name: string;
  }> = [];

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
          const compMetadata = docgenParser.parse(section.sourcePath)[0];

          const name = getName('component');

          if (section.docPath) {
            codeImportImports.push({
              name,
              path: `${section.docPath}?showroomRemarkImports`,
            });
          }

          return `{
              type: 'component',
              data: ${compileComponentSection(section, compMetadata, rootDir)},
              title: '${compMetadata && compMetadata.displayName}',
              description: \`${
                compMetadata && compMetadata.description.replace(/`/g, '\\`')
              }\`,
              slug: '${
                compMetadata
                  ? [
                      ...section.parentSlugs,
                      slugify(compMetadata.displayName, { lower: true }),
                    ].join('/')
                  : ''
              }',
              id: '${section.id}',
              shouldIgnore: ${!compMetadata}
            }`;
          // because the component parsing may return nothing, so need to set a flag here and filter it at bottom
        }

        if (section.type === 'markdown') {
          const name = getName('markdown');

          imports.push({
            type: 'default',
            name: `${name}_frontmatter`,
            path: `${section.sourcePath}?showroomFrontmatter`,
          });

          codeImportImports.push({
            name,
            path: `${section.sourcePath}?showroomRemarkDocImports`,
          });

          const chunkName = `${section.title || section.slug || ''}${name}`;

          return `{
              type: 'markdown',
              fallbackTitle: '${section.title || ''}',
              slug: '${section.slug}',
              frontmatter: ${name}_frontmatter || {},
              formatLabel: ${section.formatLabel.toString()},
              preloadUrl: '${path.relative(rootDir, section.sourcePath)}',
              load: async () => {
                const loadComponent = import(/* webpackChunkName: "${chunkName}" */'${
            section.sourcePath
          }');
                const loadImports = import(/* webpackChunkName: "${chunkName}-imports" */'${
            section.sourcePath
          }?showroomRemarkDocImports');
                const loadCodeblocks = import(/* webpackChunkName: "${chunkName}-codeblocks" */'${
            section.sourcePath
          }?showroomRemarkDocCodeblocks');

                const { default: Component, headings } = await loadComponent;

                return {
                  Component,
                  headings,
                  imports: (await loadImports).imports || {},
                  codeblocks: (await loadCodeblocks).default || {},
                }
              },
            }`;
        }

        return JSON.stringify(section);
      })
      .join(', ')}].filter(el => !el.shouldIgnore)`;
  }

  const result = collect(sections);

  return {
    sections: `${imports
      .map((imp) =>
        imp.type === 'default'
          ? `import ${imp.name} from '${imp.path}';`
          : `import * as ${imp.name} from '${imp.path}';`
      )
      .join('\n')}
    export default ${result}`,
    allImports: `${codeImportImports
      .map((imp) => `import * as ${imp.name} from '${imp.path}';`)
      .join('\n')}
    export default Object.assign({}, ${codeImportImports
      .map((imp) => `${imp.name}.imports`)
      .join(', ')});`,
  };
};

export const generateWrapper = (wrapper: string | undefined) => {
  if (wrapper) {
    return `import Wrapper from '${wrapper}';
      export default Wrapper`;
  }

  return `import * as React from 'react';
    export default React.Fragment;`;
};
