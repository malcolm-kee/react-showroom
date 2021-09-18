import { ReactShowroomComponentSection } from '@showroomjs/core/react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ComponentDataProvider } from '../components/component-data-provider';
import { ComponentDocArticle } from '../components/component-doc-article';
import { DetailsPageContainer } from '../components/details-page-container';
import { StandalonePageContainer } from '../components/standalone-page-container';
import { StandaloneEditor } from './standalone-editor';

export const ComponentDocRoute = ({
  section,
}: {
  section: ReactShowroomComponentSection;
}) => {
  const { url } = useRouteMatch();

  return (
    <ComponentDataProvider data={section.data}>
      <Switch>
        <Route path={`${url}/_standalone/:codeHash`}>
          <StandalonePageContainer>
            <StandaloneEditor />
          </StandalonePageContainer>
        </Route>
        <Route path={url}>
          <DetailsPageContainer
            title={section.data.component.displayName}
            description={section.data.component.description}
          >
            <ComponentDocArticle doc={section} />
          </DetailsPageContainer>
        </Route>
      </Switch>
    </ComponentDataProvider>
  );
};
