import { Route, Routes } from '@showroomjs/bundles/routing';
import {
  ReactShowroomMarkdownContent,
  ReactShowroomMarkdownSection,
} from '@showroomjs/core/react';
import * as React from 'react';
import { DetailsPageContainer } from '../components/details-page-container';
import { MarkdownArticle } from '../components/markdown-article';
import { MarkdownDataProvider } from '../components/markdown-data-provider';
import { MarkdownDocStandaloneEditor } from '../components/markdown-doc-standalone-editor';
import { Seo } from '../components/seo';
import { StandalonePageContainer } from '../components/standalone-page-container';
import { EXAMPLE_DIMENSIONS, showDeviceFrame } from '../lib/config';

export const MarkdownRoute = ({
  section,
  content,
  title,
}: {
  title: string;
  section: ReactShowroomMarkdownSection;
  content: ReactShowroomMarkdownContent;
}) => {
  return (
    <MarkdownDataProvider data={content}>
      <Routes>
        <Route
          path="_standalone/:codeHash"
          element={
            <StandalonePageContainer>
              <Seo
                title={title}
                description={section.frontmatter.description}
              />
              <MarkdownDocStandaloneEditor
                showDeviceFrame={showDeviceFrame}
                codeFrameDimensions={EXAMPLE_DIMENSIONS}
                rootTitle={title}
              />
            </StandalonePageContainer>
          }
        />
        <Route
          path="/"
          element={
            <DetailsPageContainer
              title={title}
              description={section.frontmatter.description}
            >
              <MarkdownArticle
                slug={section.slug}
                center={!section.frontmatter.hideSidebar}
                content={content}
              />
            </DetailsPageContainer>
          }
        />
      </Routes>
    </MarkdownDataProvider>
  );
};
