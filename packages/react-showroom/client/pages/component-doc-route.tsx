import {
  ReactShowroomComponentContent,
  ReactShowroomComponentSection,
} from '@showroomjs/core/react';
import * as React from 'react';
import { ComponentDataProvider } from '../components/component-data-provider';
import { ComponentDocArticle } from '../components/component-doc-article';
import { ComponentDocStandaloneEditor } from '../components/component-doc-standalone-editor';
import { DetailsPageContainer } from '../components/details-page-container';
import { Seo } from '../components/seo';
import { StandalonePageContainer } from '../components/standalone-page-container';
import { ExampleRootContextProvider } from '../lib/example-root-context';
import { Route, Switch, useRouteMatch } from '../lib/routing';
import { showDeviceFrame, EXAMPLE_DIMENSIONS } from '../lib/config';

export const ComponentDocRoute = ({
  section,
  content,
}: {
  section: ReactShowroomComponentSection;
  content: ReactShowroomComponentContent;
}) => {
  const { url } = useRouteMatch();

  const metadata = section.metadata;

  return (
    <ComponentDataProvider content={content} metadata={metadata}>
      <ExampleRootContextProvider value={url}>
        <Switch>
          <Route path={`${url}/_standalone/:codeHash`}>
            <StandalonePageContainer>
              <Seo
                title={metadata.displayName}
                description={metadata.description}
              />
              <ComponentDocStandaloneEditor
                showDeviceFrame={showDeviceFrame}
                codeFrameDimensions={EXAMPLE_DIMENSIONS}
              />
            </StandalonePageContainer>
          </Route>
          <Route path={url}>
            <DetailsPageContainer
              title={metadata.displayName}
              description={metadata.description}
            >
              <ComponentDocArticle
                slug={section.slug}
                metadata={metadata}
                content={content}
              />
            </DetailsPageContainer>
          </Route>
        </Switch>
      </ExampleRootContextProvider>
    </ComponentDataProvider>
  );
};
