import * as React from 'react';
import {
  ComponentDataProvider,
  ComponentDocArticle,
  ComponentDocStandaloneEditor,
  MemoryRouter,
  QueryParamProvider,
  Route,
  Switch,
  Suspense,
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
        <ComponentDataProvider {...props}>
          <Suspense fallback={null}>
            <Switch>
              <Route path="/_standalone/:codeHash">
                <div className="flex flex-col h-[50vh] min-h-[500px]">
                  <ComponentDocStandaloneEditor />
                </div>
              </Route>
              <Route>
                <div className="px-6 pb-6">
                  <ComponentDocArticle
                    slug={props.slug}
                    content={props.content}
                    metadata={props.metadata}
                  />
                </div>
              </Route>
            </Switch>
          </Suspense>
        </ComponentDataProvider>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
