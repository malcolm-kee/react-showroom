import * as docgen from 'react-docgen-typescript';
import type { LoaderDefinition } from 'webpack';
import { logToStdout } from '../lib/log-to-stdout';

export interface ShowroomAllComponentLoaderOptions {
  parse: (sourcePaths: Array<string>) => Array<docgen.ComponentDoc>;
  debug?: boolean;
}

const showroomAllComponentLoader: LoaderDefinition<ShowroomAllComponentLoaderOptions> =
  function (content) {
    const loaderOptions = this.getOptions();

    const paths = JSON.parse(content) as Array<string>;

    if (loaderOptions.debug) {
      logToStdout(
        `Parsing components at: \n${paths.map((p) => `- ${p}`).join('\n')}`
      );
    }

    paths.forEach((path) => {
      this.addDependency(path);
    });

    const compdoc = loaderOptions.parse(paths);

    return `export default ${JSON.stringify(
      compdoc.reduce(
        (result, comp) =>
          Object.assign(result, {
            [comp.filePath]: comp,
          }),
        {}
      ),
      null,
      2
    )};`;
  };

module.exports = showroomAllComponentLoader;
