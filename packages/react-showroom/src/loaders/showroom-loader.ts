import * as docgen from 'react-docgen-typescript';
import type { LoaderDefinition } from 'webpack';
import { paths } from '../lib/paths';
import slugify from 'slugify';

const docGenerator = docgen.withCustomConfig(paths.appTsConfig, {
  propFilter: (prop) => {
    if (prop.parent) {
      return !prop.parent.fileName.includes('@types/react');
    }
    return true;
  },
});

const showroomLoader: LoaderDefinition = function () {
  const compdoc = docGenerator.parse(this.resourcePath)[0];

  return `module.exports = ${JSON.stringify({
    ...compdoc,
    slug: slugify(compdoc.displayName, { lower: true }),
  })};`;
};

module.exports = showroomLoader;
