import * as React from 'react';
import {
  ComponentDataProvider,
  ComponentDocArticle,
  MemoryRouter,
  QueryParamProvider,
  Route,
  StandaloneEditor,
  ComponentMeta,
  Switch,
} from '@showroomjs/vite-react/client';
import { BrowserWindowInRouter } from './browser-window-in-router';

export const ComponentDocRoute = (props: {
  data: React.ComponentPropsWithRef<typeof ComponentDataProvider>['data'];
}) => (
  <MemoryRouter>
    <QueryParamProvider>
      <BrowserWindowInRouter className="mb-4">
        <div className="p-6">
          <ComponentDataProvider data={props.data}>
            <Switch>
              <Route path="/_standalone/:codeHash">
                <ComponentMeta componentData={props.data.component} slug="" />
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
          </ComponentDataProvider>
        </div>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
