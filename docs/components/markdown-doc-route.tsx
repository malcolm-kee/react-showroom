import * as React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import {
  MarkdownArticle,
  MarkdownDataProvider,
  QueryParamProvider,
  StandaloneEditor,
  SubRootRoute,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';

export const MarkdownDocRoute = (props: {
  data: React.ComponentPropsWithoutRef<typeof MarkdownDataProvider>['data'];
}) => (
  <MemoryRouter>
    <QueryParamProvider>
      <BrowserWindowInRouter className="mb-4">
        <div className="p-6">
          <MarkdownDataProvider data={props.data}>
            <SubRootRoute path="/">
              <div>
                <Switch>
                  <Route path="/_standalone/:codeHash">
                    <StandaloneEditor />
                  </Route>
                  <Route>
                    <MarkdownArticle section={props.data} />
                  </Route>
                </Switch>
              </div>
            </SubRootRoute>
          </MarkdownDataProvider>
        </div>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);