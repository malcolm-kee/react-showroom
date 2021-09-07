import * as ReactDOMServer from 'react-dom/server';
import { QueryClientProvider } from 'react-query';
import { StaticRouter } from 'react-router-dom';
import { App } from './app';
import { createQueryClient } from './lib/create-query-client';

export const render = ({ pathname = '/' } = {}) =>
  ReactDOMServer.renderToString(
    <StaticRouter location={{ pathname }}>
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>
    </StaticRouter>
  );

export { getCssText } from './stitches.config';
