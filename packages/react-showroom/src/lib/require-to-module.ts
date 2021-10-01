import { paths } from './paths';

export const requireToModule = (modules: Array<string> | undefined) => {
  if (modules && modules.length > 0) {
    return `${modules
      .map((mod) => {
        const finalPath = require.resolve(mod, {
          paths: [paths.appPath],
        });

        return `import '${finalPath}';`;
      })
      .join('\n')}
      export default {}`;
  }

  return `export default {}`;
};
