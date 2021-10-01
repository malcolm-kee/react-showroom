import { Route, Switch, useRouteMatch } from '@showroomjs/bundles/routing';
import {
  ReactShowroomMarkdownContent,
  ReactShowroomMarkdownSection,
} from '@showroomjs/core/react';
import { Breadcrumbs } from '@showroomjs/ui';
import * as React from 'react';
import { DetailsPageContainer } from '../components/details-page-container';
import { MarkdownArticle } from '../components/markdown-article';
import { MarkdownDataProvider } from '../components/markdown-data-provider';
import { Seo } from '../components/seo';
import { StandalonePageContainer } from '../components/standalone-page-container';
import { lazy } from '../lib/lazy';

const StandaloneEditor = lazy(
  () => import('../components/standalone-editor-lazy')
);

export const MarkdownRoute = ({
  section,
  content,
  title,
}: {
  title: string;
  section: ReactShowroomMarkdownSection;
  content: ReactShowroomMarkdownContent;
}) => {
  const { url } = useRouteMatch();

  return (
    <MarkdownDataProvider data={content}>
      <Switch>
        <Route path={`${url}/_standalone/:codeHash`}>
          <StandalonePageContainer>
            <Seo title={title} description={section.frontmatter.description} />
            <Breadcrumbs
              items={[
                {
                  label: title,
                  url,
                },
                {
                  label: 'Example',
                },
              ]}
            />
            <StandaloneEditor />
          </StandalonePageContainer>
        </Route>
        <Route path={url}>
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
        </Route>
      </Switch>
    </MarkdownDataProvider>
  );
};
