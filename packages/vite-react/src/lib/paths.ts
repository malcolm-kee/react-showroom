import * as path from 'path';
import * as fs from 'fs';

const appDirectory = fs.realpathSync(process.cwd());

const showroomDirectory = path.resolve(__dirname, '../..');

export const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

export const resolveShowroom = (relativePath: string) =>
  path.resolve(showroomDirectory, relativePath);

export const paths = {
  appPath: resolveApp('.'),
  appShowroomConfig: resolveApp('react-showroom.js'),
  appTsConfig: resolveApp('tsconfig.json'),
  appPackageJson: resolveApp('package.json'),
  showroomPath: resolveShowroom('.'),
};
