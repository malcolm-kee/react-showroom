import * as React from 'react';
import {
  deviceDimensionsByName,
  MarkdownArticle,
  MarkdownDataProvider,
  MarkdownDocStandaloneEditor,
  MemoryRouter,
  PageFallback,
  QueryParamProvider,
  Route,
  Suspense,
  Switch,
} from 'react-showroom/client';
import { BrowserWindowInRouter } from './browser-window-in-router';
import { cssVariables } from './css-variables';

export const MarkdownDocRoute = (props: {
  data: React.ComponentPropsWithoutRef<typeof MarkdownDataProvider>['data'];
  title: string;
}) => (
  <MemoryRouter>
    <QueryParamProvider>
      <BrowserWindowInRouter className="mb-4">
        <MarkdownDataProvider data={props.data}>
          <div style={cssVariables}>
            <Suspense fallback={<PageFallback title={props.title} />}>
              <Switch>
                <Route path="/_standalone/:codeHash">
                  <MarkdownDocStandaloneEditor
                    codeFrameDimensions={[
                      deviceDimensionsByName['iPhone 6/7/8'],
                      deviceDimensionsByName.iPad,
                      deviceDimensionsByName['Macbook Air'],
                    ]}
                    rootTitle={props.title}
                    showDeviceFrame
                  />
                </Route>
                <Route>
                  <div className="px-6 pb-6">
                    <MarkdownArticle slug="/docs" content={props.data} />
                  </div>
                </Route>
              </Switch>
            </Suspense>
          </div>
        </MarkdownDataProvider>
      </BrowserWindowInRouter>
    </QueryParamProvider>
  </MemoryRouter>
);
