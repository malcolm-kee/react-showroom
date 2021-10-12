import * as React from 'react';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { useParams } from '../lib/routing';
import { StandaloneCodeLiveEditor } from './standalone-code-live-editor';

/**
 * `<StandaloneEditor />` is a component that get the code from the codeHash from route params.
 */
export const StandaloneEditor = () => {
  const codeblocks = useCodeBlocks();

  const { codeHash } = useParams<{ codeHash: string }>();

  const codeData = React.useMemo(() => {
    return Object.entries(codeblocks).find(
      ([, codeBlock]) => codeBlock && codeBlock.initialCodeHash === codeHash
    );
  }, [codeHash, codeblocks]);

  return (
    <>
      {codeData && codeData[1] ? (
        <StandaloneCodeLiveEditor code={codeData[0]} lang={codeData[1].lang} />
      ) : (
        <p>Invalid codeHash</p>
      )}
    </>
  );
};
