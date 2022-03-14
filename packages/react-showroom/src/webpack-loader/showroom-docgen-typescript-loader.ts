import type { LoaderDefinition } from 'webpack';
import type { createDocParser } from '../lib/create-doc-parser';
import { logToStdout } from '../lib/log-to-stdout';

export interface ShowroomDocgenTypescriptLoaderOptions {
  parser: ReturnType<typeof createDocParser>;
  debug?: boolean;
}

const showroomDocgentTypescriptLoader: LoaderDefinition<ShowroomDocgenTypescriptLoaderOptions> =
  function (content) {
    const loaderOptions = this.getOptions();
    const resourcePath = this.resourcePath;

    if (loaderOptions.debug) {
      logToStdout(`Parsing component at: ${resourcePath}`);
    }

    const componentDoc = loaderOptions.parser.parse(resourcePath, content);

    return `export default ${JSON.stringify(componentDoc, null, 2)}`;
  };

module.exports = showroomDocgentTypescriptLoader;
