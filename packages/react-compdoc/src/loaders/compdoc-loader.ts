import * as docgen from 'react-docgen-typescript';
import type { LoaderDefinition } from 'webpack';
import { paths } from '../lib/paths';

const docGenerator = docgen.withCustomConfig(paths.appTsConfig, {
  propFilter: (prop) => {
    if (prop.parent) {
      return !prop.parent.fileName.includes('@types/react');
    }
    return true;
  },
});

const compdocLoader: LoaderDefinition = function () {
  return `module.exports = ${JSON.stringify(
    docGenerator.parse(this.resourcePath)[0]
  )};`;
};

module.exports = compdocLoader;
