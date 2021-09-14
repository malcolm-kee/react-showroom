import { DocgenConfiguration } from '@showroomjs/core/react';
import * as docgen from 'react-docgen-typescript';
import slugify from 'slugify';
import type { LoaderDefinition } from 'webpack';

let docGenerator: docgen.FileParser;

const showroomLoader: LoaderDefinition = function () {
  const sourcePath = this.resourcePath;

  const loaderOptions = this.getOptions() as DocgenConfiguration;

  if (!docGenerator) {
    docGenerator = docgen.withCustomConfig(
      loaderOptions.tsconfigPath,
      loaderOptions.options
    );
  }

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
