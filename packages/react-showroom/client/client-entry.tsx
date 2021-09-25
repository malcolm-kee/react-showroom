import { QueryClientProvider } from '@showroomjs/bundles/query';
import {
  BrowserRouter,
  HashRouter,
  matchPath,
} from '@showroomjs/bundles/routing';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import { isPrerender } from './lib/config';
import { createQueryClient } from './lib/create-query-client';
import { routes } from './route-mapping';

const queryClient = createQueryClient();

const render = isPrerender
  ? function hydrate(ui: React.ReactElement<any>, target: HTMLElement | null) {
      let pathname = window.location.pathname;

      if (pathname[pathname.length - 1] === '/') {
        pathname = pathname.substring(0, pathname.length - 1);
      }

      const matchSection = (function () {
        const routeItems = routes.slice().reverse();

        for (const mapping of routeItems) {
          if (!mapping) {
            continue;
          }

          if (Array.isArray(mapping.ui)) {
            routeItems.push(...mapping.ui);
            continue;
          }

          const match = matchPath(pathname, {
            path: mapping.path,
            exact: true,
          });

          if (match) {
            return mapping;
          }
        }
      })();

      Promise.resolve(
        matchSection && matchSection.load ? matchSection.load() : undefined
      ).then(() => {
        ReactDOM.hydrate(
          <BrowserRouter basename={process.env.BASE_PATH}>{ui}</BrowserRouter>,
          target
        );
      });
    }
  : function render(ui: React.ReactElement<any>, target: HTMLElement | null) {
      ReactDOM.render(<HashRouter>{ui}</HashRouter>, target);
    };

render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('target')
);
