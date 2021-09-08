import { IdProvider } from '@radix-ui/react-id';
import sections from 'react-compdoc-sections';
import { Route } from 'react-router-dom';
import { ComponentDocArticle } from './components/component-doc-article';
import { DetailsPageContainer } from './components/details-page-container';
import { MarkdownArticle } from './components/markdown-article';
import { useRouteChangeFocus } from './lib/use-route-change-focus';
import { HomePage } from './pages/index';

export const App = () => {
  useRouteChangeFocus();

  return (
    <IdProvider>
      {sections.map(function SectionRoute(section) {
        if (section.type === 'link') {
          return null;
        }

        if (section.type === 'group') {
          return (
            <Route path={`/${section.slug}`} key={section.slug}>
              {section.items.map((item) => SectionRoute(item))}
            </Route>
          );
        }

        if (section.type === 'component') {
          return (
            <Route path={`/${section.slug}`} key={section.slug}>
              <DetailsPageContainer title={section.data.component.displayName}>
                <ComponentDocArticle doc={section} mode="standalone" />
              </DetailsPageContainer>
            </Route>
          );
        }

        if (section.type === 'markdown') {
          return (
            <Route path={`/${section.slug}`} key={section.slug}>
              <DetailsPageContainer title={section.title}>
                <MarkdownArticle section={section} />
              </DetailsPageContainer>
            </Route>
          );
        }

        return null;
      })}
      <Route path="/" exact>
        <HomePage />
      </Route>
    </IdProvider>
  );
};
