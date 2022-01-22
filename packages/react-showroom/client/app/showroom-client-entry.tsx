import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { basename, isPrerender } from '../lib/config';
import { createQueryClient } from '../lib/create-query-client';
import { BrowserRouter as Router } from '../lib/routing';
import { loadCodeAtPath } from '../route-mapping';
import { ShowroomApp } from './showroom-app';

const queryClient = createQueryClient();

const render = isPrerender
  ? function hydrate(ui: React.ReactElement, target: HTMLElement | null) {
      loadCodeAtPath(window.location.pathname, () => {
        ReactDOM.hydrate(ui, target);
      });
    }
  : ReactDOM.render;

render(
  <Router basename={basename}>
    <QueryClientProvider client={queryClient}>
      <ShowroomApp />
    </QueryClientProvider>
  </Router>,
  document.getElementById('target')
);

if (process.env.USE_SW) {
  import('../service-worker/service-worker-registration').then((sw) =>
    sw.register()
  );
}
