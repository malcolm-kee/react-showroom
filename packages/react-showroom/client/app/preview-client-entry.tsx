import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { basename, isPrerender } from '../lib/config';
import { createQueryClient } from '../lib/create-query-client';
import { Router } from '../lib/routing';
import { PreviewApp } from './preview-app';

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
