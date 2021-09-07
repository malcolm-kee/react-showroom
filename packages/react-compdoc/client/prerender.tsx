import { Ssr, flattenArray, NestedArray } from '@compdoc/core';
import * as ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { QueryClientProvider } from 'react-query';
import sections from 'react-compdoc-sections';
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

export const getRoutes: Ssr['getRoutes'] = () =>
  flattenArray(
    sections.map(function getRoute(section): string | NestedArray<string> {
      if (section.type === 'group') {
        return section.items.map(getRoute);
      }

      if (section.type === 'component') {
        return section.slug;
      }

      if (section.type === 'markdown') {
        return section.slug;
      }

      return [];
    })
  );
