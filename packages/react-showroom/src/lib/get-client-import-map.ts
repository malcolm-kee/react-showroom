import * as _ from 'lodash';
import { getConfig } from './get-config';
import { paths, resolveApp } from './paths';

export interface ImportMapData {
  name: string;
  varName: string;
  path: string;
}

export const getClientImportMap = () => {
  const { imports } = getConfig();

  return imports
    ? imports.reduce<Record<string, ImportMapData>>((result, importConfig) => {
        if (typeof importConfig === 'string') {
          return {
            ...result,
            [importConfig]: {
              name: importConfig,
              varName: _.camelCase(importConfig),
              path: require.resolve(importConfig, {
                paths: [paths.appPath],
              }),
            },
          };
        }
        const { name, path } = importConfig;

        const varName = _.camelCase(name);

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
      }, {})
    : {};
};

const isPackage = (pathName: string) => /^[a-z\-]+$/.test(pathName);
