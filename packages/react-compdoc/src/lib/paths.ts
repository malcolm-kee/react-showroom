import * as path from 'path';
import * as fs from 'fs';

export const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
] as const;

const appDirectory = fs.realpathSync(process.cwd());

const compDocDirectory = path.resolve(__dirname, '../..');

export const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

export const resolveCompdoc = (relativePath: string) =>
  path.resolve(compDocDirectory, relativePath);

export const paths = {
  appPath: resolveApp('.'),
  appCompdocConfig: resolveApp('react-compdoc.js'),
  appTsConfig: resolveApp('tsconfig.json'),
  appPackageJson: resolveApp('package.json'),
  compDocClient: resolveCompdoc('client'),
};
