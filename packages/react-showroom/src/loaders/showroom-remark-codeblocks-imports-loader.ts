import {
  getSafeName,
  isString,
  postCompile,
  SUPPORTED_LANGUAGES,
} from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import * as esbuild from 'esbuild';
import remarkParse from 'remark-parse';
import unified from 'unified';
import vFile from 'vfile';
import type { LoaderDefinition } from 'webpack';
import { codeblocks } from '../lib/codeblocks';
import { paths, resolveApp } from '../lib/paths';

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

const parser = unified().use(remarkParse as any);

const showroomRemarkCodeblocksImportsLoader: LoaderDefinition = function (
  source,
  map,
  meta
) {
  const cb = this.async();

  const tree = parser.parse(vFile(source));

  const { imports } = this.getOptions() as {
    imports: Array<ImportConfig> | undefined;
  };

  const blocks = codeblocks(tree).codeblocks;

  const result: Array<ImportConfig> = imports ? imports.slice() : [];

  async function transformCodes() {
    for (const lang of Object.keys(blocks)) {
      if (SUPPORTED_LANGUAGES.includes(lang)) {
        for (const code of blocks[lang]) {
          try {
            const transformResult = await esbuild.transform(code, {
              loader: 'tsx',
              target: 'es2018',
            });

            const { importedPackages } = postCompile(transformResult.code);

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
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  }

  transformCodes().finally(() => {
    cb(null, getImportsAttach(result), map, meta);
  });
};

module.exports = showroomRemarkCodeblocksImportsLoader;
