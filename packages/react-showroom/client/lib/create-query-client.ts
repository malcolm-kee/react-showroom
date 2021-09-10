import Data from 'react-showroom-codeblocks';
import { QueryClient } from 'react-query';

export const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        cacheTime: 5000,
      },
    },
  });

  Data.items.forEach((item) => {
    Object.keys(item.codeBlocks).forEach((sourceCode) => {
      queryClient.setQueryData(
        ['codeCompilation', sourceCode],
        item.codeBlocks[sourceCode]
      );
    });
  });

  return queryClient;
};
