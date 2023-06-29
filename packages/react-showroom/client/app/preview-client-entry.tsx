import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { basename, isPrerender } from '../lib/config';
import { createQueryClient } from '../lib/create-query-client';
import { BrowserRouter as Router } from '../lib/routing';
import { PreviewApp } from './preview-app';

const queryClient = createQueryClient();

const render = isPrerender
  ? function hydrate(ui: React.ReactElement, target: HTMLElement) {
      hydrateRoot(target, ui);
    }
  : function render(ui: React.ReactElement, target: HTMLElement) {
      createRoot(target).render(ui);
    };

render(
  <Router basename={`${basename}/_preview`}>
    <QueryClientProvider client={queryClient}>
      <PreviewApp />
    </QueryClientProvider>
  </Router>,
  document.getElementById('preview')!
);
