import * as React from 'react';
import {
  Breadcrumbs,
  MarkdownArticle,
  MarkdownDataProvider,
  MemoryRouter,
  QueryParamProvider,
  Route,
  StandaloneEditor,
  Switch,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';

export const MarkdownDocRoute = (props: {
  data: React.ComponentPropsWithoutRef<typeof MarkdownDataProvider>['data'];
  title: string;
}) => (
  <MemoryRouter>
    <QueryParamProvider>
      <BrowserWindowInRouter className="mb-4">
        <MarkdownDataProvider data={props.data}>
          <div>
            <Switch>
              <Route path="/_standalone/:codeHash">
                <Breadcrumbs
                  items={[
                    {
                      label: props.title,
                      url: '/docs',
                    },
                    {
                      label: 'Example',
                    },
                  ]}
                />
                <StandaloneEditor />
              </Route>
              <Route>
                <div className="p-6">
                  <MarkdownArticle slug="/docs" content={props.data} />
                </div>
              </Route>
            </Switch>
          </div>
        </MarkdownDataProvider>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
