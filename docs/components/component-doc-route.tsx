import * as React from 'react';
import {
  ComponentDataProvider,
  ComponentDocArticle,
  ComponentMeta,
  MemoryRouter,
  QueryParamProvider,
  Route,
  StandaloneEditor,
  Switch,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';

type ComponentDataProviderProps = React.ComponentPropsWithRef<
  typeof ComponentDataProvider
>;

export const ComponentDocRoute = (
  props: Omit<ComponentDataProviderProps, 'children'> & {
    slug: string;
  }
) => (
  <MemoryRouter>
    <QueryParamProvider>
      <BrowserWindowInRouter className="mb-4">
        <div className="p-6">
          <ComponentDataProvider {...props}>
            <Switch>
              <Route path="/_standalone/:codeHash">
                <ComponentMeta componentData={props.data.component} slug="" />
                <StandaloneEditor />
              </Route>
              <Route>
                <ComponentDocArticle
                  doc={props.data.component}
                  slug={props.slug}
                  content={props.content}
                />
              </Route>
            </Switch>
          </ComponentDataProvider>
        </div>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
