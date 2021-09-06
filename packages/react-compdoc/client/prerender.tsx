import * as ReactDOMServer from 'react-dom/server';
import { QueryClientProvider } from 'react-query';
import { App } from './app';
import { createQueryClient } from './lib/create-query-client';

export const render = () =>
  ReactDOMServer.renderToString(
    <QueryClientProvider client={createQueryClient()}>
      <App />
    </QueryClientProvider>
  );

export { getCssText } from './stitches.config';
