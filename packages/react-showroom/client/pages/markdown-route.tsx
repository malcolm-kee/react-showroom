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
import { ExampleRootContextProvider } from '../lib/example-root-context';
import { lazy } from '../lib/lazy';
import { CodeFrameContextProvider } from '../lib/code-frame-context';
import { EXAMPLE_DIMENSIONS, showDeviceFrame } from '../lib/config';

const StandaloneEditor = lazy(
  () =>
    import(
      /* webpackChunkName: "standaloneEditor" */ '../components/standalone-editor-lazy'
    )
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
      <ExampleRootContextProvider value={url}>
        <Switch>
          <Route path={`${url}/_standalone/:codeHash`}>
            <StandalonePageContainer>
              <Seo
                title={title}
                description={section.frontmatter.description}
              />
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
              <CodeFrameContextProvider
                value={React.useMemo(
                  () => ({
                    showDeviceFrame,
                    frameDimensions: EXAMPLE_DIMENSIONS,
                  }),
                  []
                )}
              >
                <StandaloneEditor />
              </CodeFrameContextProvider>
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
      </ExampleRootContextProvider>
    </MarkdownDataProvider>
  );
};
