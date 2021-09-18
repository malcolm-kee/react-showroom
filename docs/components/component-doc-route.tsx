import * as React from 'react';
import { Route, Switch, MemoryRouter } from 'react-router-dom';
import {
  ComponentDataProvider,
  StandaloneEditor,
  SubRootRoute,
  QueryParamProvider,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';

export const ComponentDocRoute = (
  props: React.ComponentPropsWithRef<typeof ComponentDataProvider>
) => (
  <MemoryRouter>
    <QueryParamProvider>
      <BrowserWindowInRouter className="mb-4">
        <div className="p-6">
          <ComponentDataProvider data={props.data}>
            <SubRootRoute path="/">
              <div>
                <Switch>
                  <Route path="/_standalone/:codeHash">
                    <StandaloneEditor />
                  </Route>
                  <Route>{props.children}</Route>
                </Switch>
              </div>
            </SubRootRoute>
          </ComponentDataProvider>
        </div>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
