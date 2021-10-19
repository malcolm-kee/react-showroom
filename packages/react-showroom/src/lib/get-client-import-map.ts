import { getSafeName } from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import { paths, resolveApp } from './paths';

interface ImportMapData {
  name: string;
  varName: string;
  path: string;
}

export const getClientImportMap = (imports: Array<ImportConfig>) =>
  imports.reduce<Record<string, ImportMapData>>((result, importConfig) => {
    if (typeof importConfig === 'string') {
      return {
        ...result,
        [importConfig]: {
          name: importConfig,
          varName: getSafeName(importConfig),
          path: require.resolve(importConfig, {
            paths: [paths.appPath],
          }),
        },
      };
    }
    const { name, path } = importConfig;

    const varName = getSafeName(name);

    return {
      ...result,
      [name]: {
        name,
        varName,
        path: isPackage(path)
          ? require.resolve(path, {
              paths: [paths.appPath],
            })
          : resolveApp(path),
      },
    };
  }, {});

const isPackage = (pathName: string) => /^[a-z\-]+$/.test(pathName);

export const getImportsAttach = (importConfigs: Array<ImportConfig>) => {
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
