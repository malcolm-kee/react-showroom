import { QueryClientProvider } from '@showroomjs/bundles/query';
import {
  hydrate as hydrateFn,
  render as renderFn,
} from 'react-showroom-compat';
import * as React from 'react';
import { basename, isPrerender } from '../lib/config';
import { createQueryClient } from '../lib/create-query-client';
import { BrowserRouter as Router } from '../lib/routing';
import { PreviewApp } from './preview-app';

const queryClient = createQueryClient();

const render = isPrerender ? hydrateFn : renderFn;

render(
  <Router basename={`${basename}/_preview`}>
    <QueryClientProvider client={queryClient}>
      <PreviewApp />
    </QueryClientProvider>
  </Router>,
  document.getElementById('preview')
);
