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
import { EXAMPLE_DIMENSIONS, showDeviceFrame } from '../lib/config';
import { Route, Routes } from '../lib/routing';

export const ComponentDocRoute = ({
  section,
  content,
}: {
  section: ReactShowroomComponentSection;
  content: ReactShowroomComponentContent;
}) => {
  const metadata = section.metadata;

  return (
    <ComponentDataProvider content={content} metadata={metadata}>
      <Routes>
        <Route
          path="_standalone/:codeHash"
          element={
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
          }
        />
        <Route
          path="/"
          element={
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
          }
        />
      </Routes>
    </ComponentDataProvider>
  );
};
