import * as React from 'react';
import {
  CodeBlocks,
  getCompilationKey,
  useQueryClient,
} from '@showroomjs/vite-react/client';

export const useSetCompilationCaches = (codeblocks: Array<CodeBlocks>) => {
  const qClient = useQueryClient();

  React.useEffect(() => {
    codeblocks.forEach((blocks) => {
      Object.keys(blocks).forEach((soureCode) => {
        const codeData = blocks[soureCode];

        if (codeData) {
          qClient.setQueryData(
            getCompilationKey(soureCode, codeData.lang),
            blocks[soureCode]
          );
        }
      });
    });
  }, []);
};
