import * as glob from 'glob';
import * as path from 'path';

export const getTypeDefinitionsForPkg = (
  pkgName: string,
  basePath: string
): Array<{ filePath: string; modulePath: string }> => {
  try {
    const pkgPath = path.dirname(
      require.resolve(`${pkgName}/package.json`, {
        paths: [path.resolve(basePath, 'node_modules')],
      })
    );

    const result = glob.sync('**/*.d.ts', {
      cwd: pkgPath,
    });

    if (result.length > 0) {
      return ['package.json', ...result].map((file) => {
        return {
          filePath: path.join(pkgPath, file),
          modulePath: `node_modules/${pkgName}/${file}`,
        };
      });
    }

    const dtsPkgName = `@types/${getDTName(pkgName)}`;

    const dtsPkgPath = path.dirname(
      require.resolve(`${dtsPkgName}/package.json`)
    );

    const dtsResult = glob.sync('**/*.d.ts', {
      cwd: dtsPkgPath,
    });

    if (dtsResult.length > 0) {
      return ['package.json', ...dtsResult].map((file) => ({
        filePath: path.join(dtsPkgPath, file),
        modulePath: `node_modules/${dtsPkgName}/${file}`,
      }));
    }
  } catch (e) {}

  return [];
};

// Taken from dts-gen: https://github.com/microsoft/dts-gen/blob/master/lib/names.ts
function getDTName(s: string) {
  if (s.indexOf('@') === 0 && s.indexOf('/') !== -1) {
    // we have a scoped module, e.g. @bla/foo
    // which should be converted to   bla__foo
    s = s.substr(1).replace('/', '__');
  }
  return s;
}
