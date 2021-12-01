import { CodeBlocks, isString, flattenArray } from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import type { LoaderDefinition } from 'webpack';
import { getTypeDefinitionsForPkg } from '../lib/get-type-definitions-for-pkg';
import { paths } from '../lib/paths';

export interface ShowroomRemarkCodeblocksDtsLoaderOptions {
  imports: Array<ImportConfig> | undefined;
}

const showroomRemarkCodeblocksDtsLoader: LoaderDefinition<ShowroomRemarkCodeblocksDtsLoaderOptions> =
  function (_, __, meta) {
    if (!meta) {
      throw new Error(
        'showroom-remark-codeblocks-dts-loader must be piped after showroom-remark-codeblocks-loader'
      );
    }

    const processed = meta as CodeBlocks;

    const { imports } = this.getOptions();

    const allImports: Array<ImportConfig> = imports ? imports.slice() : [];

    Object.keys(processed).forEach((sourceCodeSnippet) => {
      const compiled = processed[sourceCodeSnippet];

      if (compiled) {
        const { importedPackages } = compiled;

        for (const pkgName of importedPackages) {
          if (
            !allImports.some((importConfig) =>
              isString(importConfig)
                ? importConfig === pkgName
                : importConfig.name === pkgName
            )
          ) {
            allImports.push(pkgName);
          }
        }
      }
    });

    const allTypeDefinitions = flattenArray(
      allImports
        .filter(isString)
        .map((pkg) => getTypeDefinitionsForPkg(pkg, paths.appPath))
    );

    return `${allTypeDefinitions
      .map((def, i) => `import type${i} from '${def.filePath}?raw';`)
      .join('\n')}
    
    export default {
        ${allTypeDefinitions
          .map((def, i) => `'${def.modulePath}': type${i}`)
          .join(',\n')}
    }`;
  };

module.exports = showroomRemarkCodeblocksDtsLoader;
