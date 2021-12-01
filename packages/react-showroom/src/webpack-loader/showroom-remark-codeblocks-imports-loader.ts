import { CodeBlocks, isString } from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import type { LoaderDefinition } from 'webpack';
import { getImportsAttach } from '../lib/get-client-import-map';

export interface ShowroomRemarkCodeblocksImportLoaderOptions {
  imports: Array<ImportConfig> | undefined;
  /**
   * the environment that the code will be run.
   *
   * We need to know this to determine the module resolution (i.e. using ESM or CJS)
   */
  env: 'browser' | 'node';
}

const showroomRemarkCodeblocksImportsLoader: LoaderDefinition<ShowroomRemarkCodeblocksImportLoaderOptions> =
  function (_, __, meta) {
    if (!meta) {
      throw new Error(
        `showroom-remark-codeblocks-imports-loader must be piped after showroom-remark-codeblocks-loader`
      );
    }

    const processed = meta as CodeBlocks;

    const { imports, env } = this.getOptions();

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

    return getImportsAttach(result, env);
  };

module.exports = showroomRemarkCodeblocksImportsLoader;
