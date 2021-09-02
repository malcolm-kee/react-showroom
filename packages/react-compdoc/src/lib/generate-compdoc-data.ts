import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as docgen from 'react-docgen-typescript';
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
    const component = docgen
      .withCustomConfig(paths.appTsConfig, {
        propFilter: (prop) => {
          if (prop.parent) {
            return !prop.parent.fileName.includes('@types/react');
          }
          return true;
        },
      })
      .parse(compPath)[0];

    const componentPathInfo = path.parse(compPath);
    const docPath = `${componentPathInfo.dir}/${componentPathInfo.name}.mdx`;

    return {
      component,
      doc: fs.existsSync(docPath) ? docPath : null,
    };
  });

  return `module.exports = {
      items: [
          ${componentDocItems.map(
            ({ component, doc }) => `{
              component: ${JSON.stringify(component, null, 2)},
              doc: ${doc ? `require('${doc}').default` : 'null'},
          },`
          )}
      ],
  }`;
};

function importDefault(mod: any) {
  return mod && mod.__esModule ? mod : { default: mod };
}

export const getImportsAttach = () => {
  const importMap = getClientImportMap();

  return `window.__compdoc__ = {
    moduleMap: {},
    helpers: {
      importDefault: ${importDefault.toString()}
    }
  };
${Object.values(importMap)
  .map(({ varName, path }) => `import * as ${varName} from '${path}';`)
  .join('\n')}
  ${Object.values(importMap)
    .map(
      ({ varName }) => `window.__compdoc__.moduleMap.${varName} = ${varName};`
    )
    .join('\n')}
`;
};
