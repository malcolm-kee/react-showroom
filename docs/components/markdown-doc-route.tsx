import * as React from 'react';
import {
  deviceDimensionsByName,
  MarkdownArticle,
  MarkdownDataProvider,
  MarkdownDocStandaloneEditor,
  MemoryRouter,
  PageFallback,
  Route,
  Routes,
  Suspense,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';
import { cssVariables } from './css-variables';

export const MarkdownDocRoute = (props: {
  data: React.ComponentPropsWithoutRef<typeof MarkdownDataProvider>['data'];
  title: string;
}) => (
  <MemoryRouter>
    <BrowserWindowInRouter className="mb-4">
      <MarkdownDataProvider data={props.data}>
        <div style={cssVariables}>
          <Suspense fallback={<PageFallback title={props.title} />}>
            <Routes>
              <Route
                path="_standalone/:codeHash"
                element={
                  <MarkdownDocStandaloneEditor
                    codeFrameDimensions={[
                      deviceDimensionsByName['iPhone 6/7/8'],
                      deviceDimensionsByName.iPad,
                      deviceDimensionsByName['Macbook Air'],
                    ]}
                    rootTitle={props.title}
                    showDeviceFrame
                  />
                }
              />
              <Route
                path="*"
                element={
                  <div className="px-6 pb-6">
                    <MarkdownArticle slug="/docs" content={props.data} />
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </MarkdownDataProvider>
    </BrowserWindowInRouter>
  </MemoryRouter>
);
