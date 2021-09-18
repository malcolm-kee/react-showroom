import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Div } from '../components/base';
import { StandaloneCodeLiveEditor } from '../components/standalone-code-live-editor';
import { useCodeBlocks } from '../lib/codeblocks-context';

export const StandaloneEditor = () => {
  const codeblocks = useCodeBlocks();

  const { codeHash } = useParams<{ codeHash: string }>();

  const codeData = React.useMemo(() => {
    return Object.entries(codeblocks).find(
      ([, codeBlock]) => codeBlock && codeBlock.initialCodeHash === codeHash
    );
  }, [codeHash, codeblocks]);

  return (
    <Div css={{ flex: 1 }}>
      {codeData && codeData[1] ? (
        <StandaloneCodeLiveEditor code={codeData[0]} lang={codeData[1].lang} />
      ) : (
        <p>Invalid path</p>
      )}
    </Div>
  );
};
