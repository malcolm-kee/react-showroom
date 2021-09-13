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
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true,
  shouldRemoveUndefinedFromOptional: true,
});

const showroomLoader: LoaderDefinition = function () {
  const sourcePath = this.resourcePath;

  const compdoc = docGenerator.parse(sourcePath)[0];
  return `const MaybeComponent = require('${sourcePath}');
  module.exports = {
    Component: MaybeComponent.default || MaybeComponent['${
      compdoc.displayName
    }'] || MaybeComponent,
    slug: '${slugify(compdoc.displayName, { lower: true })}',
    ${Object.entries(compdoc)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)},`)
      .join('\n')}
  };`;
};

module.exports = showroomLoader;
