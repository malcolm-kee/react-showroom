import type { Code as MdCode } from 'mdast';
import type { LoaderDefinition } from 'webpack';
import { mdToCodeBlocks } from '../lib/codeblocks';

export interface ShowroomRemarkCodeBlocksLoaderOptions {
  filter?: (code: MdCode) => boolean;
}

const showroomRemarkCodeblocksLoader: LoaderDefinition<ShowroomRemarkCodeBlocksLoaderOptions> =
  function (source, map, meta) {
    const options = this.getOptions();

    const callback = this.async();

    mdToCodeBlocks(source, options.filter)
      .then((result) => {
        callback(
          null,
          `export default ${JSON.stringify(result)}`,
          map,
          meta
            ? {
                ...meta,
                ...result,
              }
            : (result as any)
        );
      })
      .catch((err) => callback(err));
  };

module.exports = showroomRemarkCodeblocksLoader;
