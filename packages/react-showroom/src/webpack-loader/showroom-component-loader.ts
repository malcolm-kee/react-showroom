import * as docgen from 'react-docgen-typescript';
import type { LoaderDefinition } from 'webpack';
import { logToStdout } from '../lib/log-to-stdout';

export interface ShowroomComponentLoaderOptions {
  docgenParser: docgen.FileParser;
  debug?: boolean;
}

const showroomComponentLoader: LoaderDefinition<ShowroomComponentLoaderOptions> =
  function () {
    const sourcePath = this.resourcePath;

    const loaderOptions = this.getOptions();

    if (loaderOptions.debug) {
      logToStdout(`Parsing component at ${sourcePath}`);
    }

    const compdoc = loaderOptions.docgenParser.parse(sourcePath)[0];

    if (!compdoc) {
      return `export default {};`;
    }

    return `const MaybeComponent = require('${sourcePath}');
  export default {
    Component: MaybeComponent.default || MaybeComponent['${
      compdoc.displayName
    }'] || MaybeComponent,
    ${Object.entries(compdoc)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)},`)
      .join('\n')}
  };`;
  };

module.exports = showroomComponentLoader;
