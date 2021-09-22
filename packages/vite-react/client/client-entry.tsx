import { QueryClientProvider } from '@showroomjs/bundles/query';
import { BrowserRouter, HashRouter } from '@showroomjs/bundles/routing';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import { createQueryClient } from './lib/create-query-client';

const queryClient = createQueryClient();

const isPrerender = process.env.PRERENDER;

const render = isPrerender ? ReactDOM.hydrate : ReactDOM.render;

const Router: React.ComponentType<{ children: React.ReactNode }> = (props) =>
  isPrerender ? (
    <BrowserRouter basename={process.env.BASE_PATH}>
      {props.children}
    </BrowserRouter>
  ) : (
    <HashRouter>{props.children}</HashRouter>
  );

render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>,
  document.getElementById('target')
);
