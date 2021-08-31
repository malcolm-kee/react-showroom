import { MDXProvider, MDXProviderComponentsProp } from '@mdx-js/react';
import 'react-compdoc-app-components';
import Data from 'react-compdoc-components';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from './app';
import { Code, Pre } from './components/code-block';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: 5000,
    },
  },
});

const components: MDXProviderComponentsProp = {
  pre: Pre,
  code: Code,
};

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <MDXProvider components={components}>
      <App data={Data} />
    </MDXProvider>
  </QueryClientProvider>,
  document.getElementById('target')
);
