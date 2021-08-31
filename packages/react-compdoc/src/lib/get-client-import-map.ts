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

  return imports.reduce<Record<string, ImportMapData>>(
    (result, { name, path }) => {
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
    },
    {}
  );
};

const isPackage = (pathName: string) => /^[a-z\-]+$/.test(pathName);
