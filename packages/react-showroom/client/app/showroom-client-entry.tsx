import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { basename, isPrerender } from '../lib/config';
import { createQueryClient } from '../lib/create-query-client';
import { BrowserRouter as Router } from '../lib/routing';
import { loadCodeAtPath } from '../route-mapping';
import { ShowroomApp } from './showroom-app';

const queryClient = createQueryClient();

const render = isPrerender
  ? function hydrate(ui: React.ReactElement, target: HTMLElement) {
      loadCodeAtPath(window.location.pathname, () => {
        hydrateRoot(target, ui);
      });
    }
  : function render(ui: React.ReactElement, target: HTMLElement) {
      createRoot(target).render(ui);
    };

render(
  <Router basename={basename}>
    <QueryClientProvider client={queryClient}>
      <ShowroomApp />
    </QueryClientProvider>
  </Router>,
  document.getElementById('target')!
);

if (process.env.USE_SW) {
  import('../service-worker/service-worker-registration').then((sw) =>
    sw.register()
  );
}
