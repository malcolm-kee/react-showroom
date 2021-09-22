import { Route, Switch, useRouteMatch } from '@showroomjs/bundles/routing';
import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import * as React from 'react';
import { Div, H1, NavLink } from '../components/base';
import { DetailsPageContainer } from '../components/details-page-container';
import { MarkdownArticle } from '../components/markdown-article';
import { MarkdownDataProvider } from '../components/markdown-data-provider';
import { StandaloneEditor } from '../components/standalone-editor';
import { StandalonePageContainer } from '../components/standalone-page-container';

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
            <Div css={{ px: '$4', paddingTop: '$6' }}>
              <H1>
                <NavLink
                  to={url}
                  css={{
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {section.title}
                </NavLink>
              </H1>
            </Div>
            <StandaloneEditor />
          </StandalonePageContainer>
        </Route>
        <Route path={url}>
          <DetailsPageContainer
            title={section.slug === '' ? undefined : section.title}
            description={section.frontmatter.description}
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
