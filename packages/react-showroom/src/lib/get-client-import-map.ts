import { getSafeName } from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import { paths, resolveApp } from './paths';
import resolve from 'enhanced-resolve';

type Env = 'browser' | 'node';

const resolveEs = resolve.create.sync({
  mainFields: ['browser', 'module', 'main'],
  conditionNames: ['import', 'require', 'node'],
});

const resolveCommonJs = resolve.create.sync({
  mainFields: ['module', 'main'],
  conditionNames: ['require', 'node'],
});

function getPkgResolvedFile(path: string, env: Env): string {
  try {
    const resolvedResult =
      env === 'browser'
        ? resolveEs(paths.appPath, path)
        : resolveCommonJs(paths.appPath, path);

    if (resolvedResult) {
      return resolvedResult;
    }
  } catch (err) {
    console.group('error');
    console.error(err);
    console.groupEnd();
  }

  return require.resolve(path, {
    paths: [paths.appPath],
  });
}
interface ImportMapData {
  name: string;
  varName: string;
  path: string;
}

export const getClientImportMap = (imports: Array<ImportConfig>, env: Env) =>
  imports.reduce<Record<string, ImportMapData>>((result, importConfig) => {
    if (typeof importConfig === 'string') {
      return {
        ...result,
        [importConfig]: {
          name: importConfig,
          varName: getSafeName(importConfig),
          path: getPkgResolvedFile(importConfig, env),
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
          ? getPkgResolvedFile(path, env)
          : resolveApp(path),
      },
    };
  }, {});

const isPackage = (pathName: string) => /^[a-z\-]+$/.test(pathName);

export const getImportsAttach = (
  importConfigs: Array<ImportConfig>,
  environment: Env
) => {
  const importMap = getClientImportMap(importConfigs, environment);

  return `export const imports = {};
${Object.values(importMap)
  .map(({ varName, path }) => `import * as ${varName} from '${path}';`)
  .join('\n')}
  ${Object.values(importMap)
    .map(({ varName }) => `imports.${varName} = ${varName};`)
    .join('\n')}
`;
};
