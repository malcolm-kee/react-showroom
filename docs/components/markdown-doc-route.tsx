import * as React from 'react';
import {
  MarkdownArticle,
  MarkdownDataProvider,
  MemoryRouter,
  QueryParamProvider,
  Route,
  StandaloneEditor,
  Switch,
} from '@showroomjs/vite-react/client';
import { BrowserWindowInRouter } from './browser-window-in-router';

export const MarkdownDocRoute = (props: {
  data: React.ComponentPropsWithoutRef<typeof MarkdownDataProvider>['data'];
}) => (
  <MemoryRouter>
    <QueryParamProvider>
      <BrowserWindowInRouter className="mb-4">
        <div className="p-6">
          <MarkdownDataProvider data={props.data}>
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
          </MarkdownDataProvider>
        </div>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
