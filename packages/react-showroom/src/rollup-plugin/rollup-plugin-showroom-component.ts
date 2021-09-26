import * as docgen from 'react-docgen-typescript';
import { Plugin } from 'vite';
import { logToStdout } from '../lib/log-to-stdout';

export interface RollupPluginShowroomComponentOptions {
  resourceQuery: string;
  docgenParser: docgen.FileParser;
  debug?: boolean;
}

export const RollupPluginShowroomComponent =
  function RollupPluginShowroomComponent(
    providedOptions: RollupPluginShowroomComponentOptions
  ): Plugin {
    const options = providedOptions as RollupPluginShowroomComponentOptions;

    return {
      name: 'rollup-plugin-showroom-component',
      load(id) {
        if (id.endsWith(`?${options.resourceQuery}`)) {
          const sourcePath = id.slice(0, -`?${options.resourceQuery}`.length);

          if (options.debug) {
            logToStdout(`Parsing component at ${sourcePath}`);
          }

          const compdoc = options.docgenParser.parse(sourcePath)[0];

          if (!compdoc) {
            return `export default {};`;
          }

          return `import * as MaybeComponent from '${sourcePath}';
            export default {
                Component: MaybeComponent.default || MaybeComponent['${
                  compdoc.displayName
                }'],
                ${Object.entries(compdoc)
                  .map(([key, value]) => `${key}: ${JSON.stringify(value)},`)
                  .join('\n')}
            }`;
        }
        return null;
      },
    };
  };
