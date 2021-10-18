import type { Code as MdCode } from 'mdast';
import type { LoaderDefinition } from 'webpack';
import { mdToCodeBlocks } from '../lib/codeblocks';

export interface ShowroomRemarkCodeBlocksLoaderOptions {
  filter?: (code: MdCode) => boolean;
}

const showroomRemarkCodeblocksLoader: LoaderDefinition<ShowroomRemarkCodeBlocksLoaderOptions> =
  function (source, map, meta) {
    const options = this.getOptions();

    const result = mdToCodeBlocks(source, options.filter);

    this.callback(
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
  };

module.exports = showroomRemarkCodeblocksLoader;
