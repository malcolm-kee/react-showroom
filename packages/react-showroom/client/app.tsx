import { IdProvider } from '@radix-ui/react-id';
import { Route, Switch } from 'react-router-dom';
import sections from 'react-showroom-sections';
import Wrapper from 'react-showroom-wrapper';
import { ComponentDocArticle } from './components/component-doc-article';
import { DetailsPageContainer } from './components/details-page-container';
import { MarkdownArticle } from './components/markdown-article';
import { CodeThemeContext } from './lib/code-theme-context';
import { DialogContextProvider } from './lib/dialog-context';
import { DefaultHomePage } from './pages/index';
import { colorTheme, THEME } from './theme';

export const App = () => {
  return (
    <Wrapper>
      <IdProvider>
        <div className={colorTheme}>
          <CodeThemeContext.Provider value={THEME.codeTheme}>
            <DialogContextProvider>
              <Switch>
                {sections.map(function SectionRoute(section) {
                  if (section.type === 'link') {
                    return null;
                  }

                  if (section.type === 'group') {
                    return (
                      <Route
                        path={`/${section.slug}`}
                        exact={section.slug === ''}
                        key={section.slug}
                      >
                        {section.items.map((item) => SectionRoute(item))}
                      </Route>
                    );
                  }

                  if (section.type === 'component') {
                    return (
                      <Route path={`/${section.slug}`} key={section.slug}>
                        <DetailsPageContainer
                          title={section.data.component.displayName}
                          description={section.data.component.description}
                        >
                          <ComponentDocArticle doc={section} />
                        </DetailsPageContainer>
                      </Route>
                    );
                  }

                  if (section.type === 'markdown') {
                    return (
                      <Route
                        path={`/${section.slug}`}
                        exact={section.slug === ''}
                        key={section.slug}
                      >
                        <DetailsPageContainer
                          title={
                            section.slug === '' ? undefined : section.title
                          }
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
                    );
                  }

                  return null;
                })}
                <Route path="/" exact>
                  <DefaultHomePage />
                </Route>
              </Switch>
            </DialogContextProvider>
          </CodeThemeContext.Provider>
        </div>
      </IdProvider>
    </Wrapper>
  );
};
