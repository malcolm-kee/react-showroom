import Data from 'react-compdoc-components';
import * as ReactDOM from 'react-dom';
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

ReactDOM.render(
  <>
    <QueryClientProvider client={queryClient}>
      <App data={Data} />
    </QueryClientProvider>
  </>,
  document.getElementById('target')
);
