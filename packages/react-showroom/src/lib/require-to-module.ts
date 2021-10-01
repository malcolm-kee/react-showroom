import { paths } from './paths';

export const requireToModule = (modules: Array<string> | undefined) => {
  if (modules && modules.length > 0) {
    return `${modules.map(
      (mod) =>
        `import '${require.resolve(mod, {
          paths: [paths.appPath],
        })}';`
    )}
      export default {}`;
  }

  return `export default {}`;
};
