import * as docgen from 'react-docgen-typescript';
import type { LoaderDefinition } from 'webpack';
import { logToStdout } from '../lib/log-to-stdout';

export interface ShowroomAllComponentLoaderOptions {
  parse: (sourcePaths: Array<string>) => Array<docgen.ComponentDoc>;
  debug?: boolean;
}

const showroomAllComponentPropLoader: LoaderDefinition<ShowroomAllComponentLoaderOptions> =
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

    const allCompDefs = compdoc.map(
      (comp) => `declare const ${comp.displayName}: React.ComponentType<{
      ${Object.entries(comp.props)
        .map(
          ([propName, propDef]) =>
            `'${propName}'${propDef.required ? '' : '?'}: ${propDef.type.name};`
        )
        .join('\n')}
    }>;`
    );

    return `export default ${JSON.stringify(allCompDefs.join('\n'))};`;
  };

module.exports = showroomAllComponentPropLoader;
