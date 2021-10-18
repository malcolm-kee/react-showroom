import * as path from 'path';

const pkgJsonPath = path.resolve(__dirname, '../../package.json');

export const pkgData = require(pkgJsonPath) as {
  name: string;
  version: string;
};
