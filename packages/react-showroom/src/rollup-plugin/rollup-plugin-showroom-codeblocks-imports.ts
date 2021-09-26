import { getSafeName, isString } from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import fs from 'fs-extra';
import { mdToCodeBlocks } from '../lib/codeblocks';
import { paths, resolveApp } from '../lib/paths';
import { RollupPluginShowroomCodeblocksOptions } from './rollup-plugin-showroom-codeblocks';

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
          path: importConfig,
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

  return `${Object.values(importMap)
    .map(({ varName, path }) => `import * as ${varName} from '${path}';`)
    .join('\n')}
    export const imports = {};
    ${Object.values(importMap)
      .map(({ varName }) => `imports.${varName} = ${varName};`)
      .join('\n')}
  `;
};

export interface RollupPluginShowroomCodeblocksImportsOptions
  extends RollupPluginShowroomCodeblocksOptions {
  imports: Array<ImportConfig> | undefined;
}

export const RollupPluginShowroomCodeblocksImports = function ({
  extensions = ['md', 'mdx'],
  resourceQuery,
  filter,
  imports,
}: RollupPluginShowroomCodeblocksImportsOptions) {
  const fileSpecs = extensions.map((ext) => ({
    ext,
    query: `?${resourceQuery}`,
    ending: `.${ext}?${resourceQuery}`,
  }));

  return {
    name: 'rollup-plugin-showroom-codeblocks-imports',
    async load(id: string) {
      const match = fileSpecs.find((spec) => id.endsWith(spec.ending));
      if (match) {
        const oriPath = id.slice(0, -match.query.length);

        const codeBlocks = mdToCodeBlocks(
          await fs.readFile(oriPath, 'utf-8'),
          filter
        );

        const result: Array<ImportConfig> = imports ? imports.slice() : [];

        Object.keys(codeBlocks).forEach((sourceCodeSnippet) => {
          const compiled = codeBlocks[sourceCodeSnippet];

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
      }
      return null;
    },
  };
};
