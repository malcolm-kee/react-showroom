import { CodeBlocks, getSafeName, isString } from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import type { LoaderDefinition } from 'webpack';
import { paths, resolveApp } from '../lib/paths';

export interface ShowroomRemarkCodeblocksImportLoaderOptions {
  imports: Array<ImportConfig> | undefined;
}

interface ImportMapData {
  name: string;
  varName: string;
  path: string;
}

const getClientImportMap = (imports: Array<ImportConfig>) =>
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

const getImportsAttach = (importConfigs: Array<ImportConfig>) => {
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

const showroomRemarkCodeblocksImportsLoader: LoaderDefinition<ShowroomRemarkCodeblocksImportLoaderOptions> =
  function (_, __, meta) {
    if (!meta) {
      throw new Error(
        `showroom-remark-codeblocks-imports-loader must be piped after showroom-remark-codeblocks-loader`
      );
    }

    const processed = meta as CodeBlocks;

    const { imports } = this.getOptions();

    const result: Array<ImportConfig> = imports ? imports.slice() : [];

    Object.keys(processed).forEach((sourceCodeSnippet) => {
      const compiled = processed[sourceCodeSnippet];

      if (compiled) {
        const { importedPackages } = compiled;

        for (const pkgName of importedPackages) {
          if (
            !result.some((importConfig) =>
              isString(importConfig)
                ? importConfig === pkgName
                : importConfig.name === pkgName
            )
          ) {
            result.push(pkgName);
          }
        }
      }
    });

    return getImportsAttach(result);
  };

module.exports = showroomRemarkCodeblocksImportsLoader;
