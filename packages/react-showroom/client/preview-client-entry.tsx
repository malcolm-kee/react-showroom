import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createQueryClient } from './lib/create-query-client';
import { PreviewApp } from './preview-app';
import { Router } from './lib/routing';
import { basename, isPrerender } from './lib/config';

const queryClient = createQueryClient();

const render = isPrerender ? ReactDOM.hydrate : ReactDOM.render;

render(
  <Router basename={`${basename}/_preview`}>
    <QueryClientProvider client={queryClient}>
      <PreviewApp />
    </QueryClientProvider>
  </Router>,
  document.getElementById('preview')
);
