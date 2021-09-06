import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { getClientImportMap } from './get-client-import-map';
import { getConfig } from './get-config';
import { paths } from './paths';

export const generateCompdocData = async () => {
  const { components } = getConfig();

  const componentPaths = glob.sync(components, {
    cwd: paths.appPath,
    absolute: true,
  });

  const componentDocItems = componentPaths.map((compPath) => {
    const componentPathInfo = path.parse(compPath);
    const docPath = `${componentPathInfo.dir}/${componentPathInfo.name}.mdx`;

    return {
      doc: fs.existsSync(docPath) ? docPath : null,
      codeBlocks: fs.existsSync(docPath)
        ? `require('${docPath}?compdocRemark')`
        : null,
      component: `require('compdoc-loader?modules!${compPath}')`,
    };
  });

  return `module.exports = {
      items: [
          ${componentDocItems
            .map(
              ({ doc, component, codeBlocks }) => `{
              doc: ${doc ? `require('${doc}').default` : 'null'},
              codeBlocks: ${codeBlocks || '{}'},
              component: ${component},
          },`
            )
            .join('')}
      ],
  }`;
};

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
