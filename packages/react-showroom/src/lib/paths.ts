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

const showroomDirectory = path.resolve(__dirname, '../..');

export const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

export const resolveShowroom = (relativePath: string) =>
  path.resolve(showroomDirectory, relativePath);

export const paths = {
  appPath: resolveApp('.'),
  appShowroomConfig: resolveApp('react-showroom.config.js'),
  appTsConfig: resolveApp('tsconfig.json'),
  appPackageJson: resolveApp('package.json'),
  showroomPath: resolveShowroom('.'),
};
