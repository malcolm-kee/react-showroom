import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { basename, isPrerender } from '../lib/config';
import { createQueryClient } from '../lib/create-query-client';
import { Router } from '../lib/routing';
import { loadCodeAtPath } from '../route-mapping';
import { ShowroomApp } from './showroom-app';

const queryClient = createQueryClient();

const render = isPrerender
  ? function hydrate(ui: React.ReactElement<any>, target: HTMLElement | null) {
      loadCodeAtPath(window.location.pathname, () => {
        const el = document.createElement('div');

        const uiEl = <Router basename={basename}>{ui}</Router>;

        // we do this render on a virtual div to avoid lazy loading show the flashing fallback
        ReactDOM.render(uiEl, el, () => {
          ReactDOM.unmountComponentAtNode(el);
          ReactDOM.hydrate(uiEl, target);
        });
      });
    }
  : function render(ui: React.ReactElement<any>, target: HTMLElement | null) {
      ReactDOM.render(<Router basename={basename}>{ui}</Router>, target);
    };

render(
  <QueryClientProvider client={queryClient}>
    <ShowroomApp />
  </QueryClientProvider>,
  document.getElementById('target')
);
