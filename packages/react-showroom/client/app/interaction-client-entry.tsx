import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { basename, isPrerender } from '../lib/config';
import { createQueryClient } from '../lib/create-query-client';
import { BrowserRouter as Router } from '../lib/routing';
import { InteractionApp } from './interaction-app';

const queryClient = createQueryClient();

const render = isPrerender ? ReactDOM.hydrate : ReactDOM.render;

render(
  <Router basename={`${basename}/_interaction`}>
    <QueryClientProvider client={queryClient}>
      <InteractionApp />
    </QueryClientProvider>
  </Router>,
  document.getElementById('interaction')
);
