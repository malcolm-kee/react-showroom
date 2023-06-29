import * as React from 'react';
import {
  ComponentDataProvider,
  ComponentDocArticle,
  ComponentDocStandaloneEditor,
  MemoryRouter,
  PageFallback,
  Route,
  Routes,
  Suspense,
  deviceDimensionsByName,
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
) => {
  return (
    <MemoryRouter>
      <BrowserWindowInRouter className="mb-4">
        <ComponentDataProvider {...props}>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route
                path="_standalone/:codeHash"
                element={
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
                }
              />
              <Route
                path="*"
                element={
                  <div className="px-6 pb-6" style={cssVariables}>
                    <ComponentDocArticle
                      slug={props.slug}
                      content={props.content}
                      metadata={props.metadata}
                    />
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </ComponentDataProvider>
      </BrowserWindowInRouter>
    </MemoryRouter>
  );
};
