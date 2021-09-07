import { Ssr } from '@compdoc/core';
import * as ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { QueryClientProvider } from 'react-query';
import { StaticRouter } from 'react-router-dom';
import { App } from './app';
import { createQueryClient } from './lib/create-query-client';

export const render: Ssr['render'] = ({ pathname = '/' } = {}) =>
  ReactDOMServer.renderToString(
    <StaticRouter location={{ pathname }}>
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>
    </StaticRouter>
  );

export { getCssText } from './stitches.config';

export const getHelmet: Ssr['getHelmet'] = () => Helmet.renderStatic();
