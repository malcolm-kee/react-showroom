import { QueryClientProvider } from '@showroomjs/bundles/query';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'react-showroom-require';
import { App } from './app';
import { isPrerender, isSpa } from './lib/config';
import { createQueryClient } from './lib/create-query-client';
import { BrowserRouter, HashRouter } from './lib/routing';
import { loadCodeAtPath } from './route-mapping';

const queryClient = createQueryClient();

const Router = function (props: {
  children: React.ReactNode;
  basename?: string;
}) {
  if (isSpa) {
    return <HashRouter>{props.children}</HashRouter>;
  }

  return <BrowserRouter {...props} />;
};

const render = isPrerender
  ? function hydrate(ui: React.ReactElement<any>, target: HTMLElement | null) {
      loadCodeAtPath(window.location.pathname, () => {
        const el = document.createElement('div');

        const uiEl = <Router basename={process.env.BASE_PATH}>{ui}</Router>;

        // we do this render on a virtual div to avoid lazy loading show the flashing fallback
        ReactDOM.render(uiEl, el, () => {
          ReactDOM.unmountComponentAtNode(el);
          ReactDOM.hydrate(uiEl, target);
        });
      });
    }
  : function render(ui: React.ReactElement<any>, target: HTMLElement | null) {
      ReactDOM.render(
        <Router basename={process.env.BASE_PATH}>{ui}</Router>,
        target
      );
    };

render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('target')
);
