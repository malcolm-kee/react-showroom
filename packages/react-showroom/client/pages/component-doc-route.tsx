import { Route, Switch, useRouteMatch } from '@showroomjs/bundles/routing';
import {
  ReactShowroomComponentContent,
  ReactShowroomComponentSection,
} from '@showroomjs/core/react';
import * as React from 'react';
import { ComponentDataProvider } from '../components/component-data-provider';
import { ComponentDocArticle } from '../components/component-doc-article';
import { ComponentDocStandaloneEditor } from '../components/component-doc-standalone-editor';
import { DetailsPageContainer } from '../components/details-page-container';
import { StandalonePageContainer } from '../components/standalone-page-container';

export const ComponentDocRoute = ({
  section,
  content,
}: {
  section: ReactShowroomComponentSection;
  content: ReactShowroomComponentContent;
}) => {
  const { url } = useRouteMatch();

  return (
    <ComponentDataProvider data={section.data} content={content}>
      <Switch>
        <Route path={`${url}/_standalone/:codeHash`}>
          <StandalonePageContainer>
            <ComponentDocStandaloneEditor componentData={section} />
          </StandalonePageContainer>
        </Route>
        <Route path={url}>
          <DetailsPageContainer
            title={section.data.component.displayName}
            description={section.data.component.description}
          >
            <ComponentDocArticle
              doc={section.data.component}
              slug={section.slug}
              content={content}
            />
          </DetailsPageContainer>
        </Route>
      </Switch>
    </ComponentDataProvider>
  );
};
