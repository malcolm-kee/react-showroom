import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { DetailsPageContainer } from '../components/details-page-container';
import { MarkdownArticle } from '../components/markdown-article';
import { MarkdownDataProvider } from '../components/markdown-data-provider';
import { StandalonePageContainer } from '../components/standalone-page-container';
import { StandaloneEditor } from './standalone-editor';

export const MarkdownRoute = ({
  section,
}: {
  section: ReactShowroomMarkdownSection;
}) => {
  const { url } = useRouteMatch();

  return (
    <MarkdownDataProvider data={section}>
      <Switch>
        <Route path={`${url}/_standalone/:codeHash`}>
          <StandalonePageContainer>
            <StandaloneEditor />
          </StandalonePageContainer>
        </Route>
        <Route path={url}>
          <DetailsPageContainer
            title={section.slug === '' ? undefined : section.title}
            description={section.frontmatter.description}
            hideSidebar={section.frontmatter.hideSidebar}
            hideHeader={section.frontmatter.hideHeader}
          >
            <MarkdownArticle
              section={section}
              center={!section.frontmatter.hideSidebar}
            />
          </DetailsPageContainer>
        </Route>
      </Switch>
    </MarkdownDataProvider>
  );
};
