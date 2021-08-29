import * as glob from 'glob';
import { getConfig } from './get-config';
import { paths } from './paths';
import * as path from 'path';
import * as docgen from 'react-docgen-typescript';
import * as fs from 'fs';

export const generateCompdocData = () => {
  const { components } = getConfig();

  const componentPaths = glob.sync(components, {
    cwd: paths.appPath,
    absolute: true,
  });

  const componentDocItems = componentPaths
    .map((compPath) => {
      const component = docgen
        .withCustomConfig(paths.appTsConfig, {})
        .parse(compPath)[0];

      const componentPathInfo = path.parse(compPath);
      const docPath = `${componentPathInfo.dir}/${componentPathInfo.name}.mdx`;

      return {
        component,
        doc: fs.existsSync(docPath) ? docPath : null,
      };
    })
    .filter((item) => !!item.component);

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
