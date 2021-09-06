import Data from 'react-compdoc-components';
import * as ReactDOMServer from 'react-dom/server';
import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from './app';

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

export const render = () =>
  ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <App data={Data} />
    </QueryClientProvider>
  );

export { getCssText } from './stitches.config';
