import { QueryClientProvider } from '@showroomjs/bundles/query';
import { StaticRouter } from '@showroomjs/bundles/routing';
import { flattenArray, isDefined, NestedArray, Ssr } from '@showroomjs/core';
import * as ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import sections from 'react-showroom-sections';
import { App } from './app';
import { createQueryClient } from './lib/create-query-client';

export const render: Ssr['render'] = ({ pathname }) =>
  ReactDOMServer.renderToString(
    <StaticRouter location={{ pathname }} basename={process.env.BASE_PATH}>
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>
    </StaticRouter>
  );

export { getCssText } from '@showroomjs/ui';

export const getHelmet: Ssr['getHelmet'] = () => Helmet.renderStatic();

export const getRoutes: Ssr['getRoutes'] = () =>
  flattenArray(
    sections.map(function getRoute(section): string | NestedArray<string> {
      if (section.type === 'group') {
        return section.items.map(getRoute);
      }

      if (section.type === 'component') {
        const standaloneRoutes = Object.values(section.data.codeblocks)
          .map((block) => block?.initialCodeHash)
          .filter(isDefined);

        return [section.slug].concat(
          standaloneRoutes.map(
            (route) => `${section.slug}/_standalone/${route}`
          )
        );
      }

      if (section.type === 'markdown') {
        const standaloneRoutes = Object.values(section.codeblocks)
          .map((block) => block?.initialCodeHash)
          .filter(isDefined);

        return [section.slug].concat(
          standaloneRoutes.map(
            (route) => `${section.slug}/_standalone/${route}`
          )
        );
      }

      return [];
    })
  );
