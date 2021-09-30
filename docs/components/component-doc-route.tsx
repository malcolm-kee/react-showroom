import * as React from 'react';
import {
  ComponentDataProvider,
  ComponentDocArticle,
  ComponentDocStandaloneEditor,
  MemoryRouter,
  QueryParamProvider,
  Route,
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
        <div className="px-6 pb-6">
          <ComponentDataProvider {...props}>
            <Switch>
              <Route path="/_standalone/:codeHash">
                <ComponentDocStandaloneEditor slug="" content={props.content} />
              </Route>
              <Route>
                <ComponentDocArticle
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
