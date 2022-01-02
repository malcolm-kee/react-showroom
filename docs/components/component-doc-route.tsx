import * as React from 'react';
import {
  ComponentDataProvider,
  ComponentDocArticle,
  ComponentDocStandaloneEditor,
  deviceDimensionsByName,
  MemoryRouter,
  PageFallback,
  QueryParamProvider,
  Route,
  Suspense,
  Switch,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';
import { cssVariables } from './css-variables';

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
          <Suspense fallback={<PageFallback />}>
            <Switch>
              <Route path="/_standalone/:codeHash">
                <div
                  className="flex flex-col min-h-[500px]"
                  style={cssVariables}
                >
                  <ComponentDocStandaloneEditor
                    codeFrameDimensions={[
                      deviceDimensionsByName['iPhone 6/7/8'],
                      deviceDimensionsByName.iPad,
                      deviceDimensionsByName['Macbook Air'],
                    ]}
                    showDeviceFrame
                  />
                </div>
              </Route>
              <Route>
                <div className="px-6 pb-6" style={cssVariables}>
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
