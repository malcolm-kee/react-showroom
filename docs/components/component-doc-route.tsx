import * as React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import {
  ComponentDataProvider,
  ComponentDocArticle,
  QueryParamProvider,
  StandaloneEditor,
  SubRootRoute,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';

export const ComponentDocRoute = (props: {
  data: React.ComponentPropsWithRef<typeof ComponentDataProvider>['data'];
}) => (
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
                  <Route>
                    <ComponentDocArticle
                      doc={{
                        type: 'component',
                        slug: props.data.component.slug,
                        data: props.data,
                      }}
                    />
                  </Route>
                </Switch>
              </div>
            </SubRootRoute>
          </ComponentDataProvider>
        </div>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
