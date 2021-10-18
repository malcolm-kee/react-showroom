import { IdProvider, QueryParamProvider } from '@showroomjs/ui';
import * as React from 'react';
import sections from 'react-showroom-sections';
import Wrapper from 'react-showroom-wrapper';
import { Div } from './components/base';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';
import { CodeThemeContext } from './lib/code-theme-context';
import { Suspense } from './lib/lazy';
import { matchPath, Route, Switch, useLocation } from './lib/routing';
import { DefaultHomePage } from './pages/index';
import { routeMapping, routes } from './route-mapping';
import { colorTheme, THEME } from './theme';

export const App = () => {
  const location = useLocation();

  const lastPathName = React.useRef(location.pathname);

  React.useEffect(() => {
    const hashMatch = location.hash;

    if (hashMatch) {
      const hashTarget = document.getElementById(hashMatch.replace(/^#/, ''));

      if (hashTarget) {
        let isCurrent = true;

        import('scroll-into-view-if-needed').then((scroll) => {
          if (isCurrent) {
            scroll.default(hashTarget, {
              scrollMode: 'if-needed',
            });
          }
        });

        return () => {
          isCurrent = false;
        };
      }
    } else {
      if (lastPathName.current !== location.pathname) {
        window.scrollTo(0, 0);
        lastPathName.current = location.pathname;
      }
    }
  }, [location]);

  const matchedSection = React.useMemo(() => {
    for (const mapping of routeMapping) {
      const match = matchPath(location.pathname, {
        path: mapping.path,
        exact: true,
      });

      if (match) {
        return mapping.section;
      }
    }
  }, [location.pathname]);

  const shouldHideHeader =
    matchedSection &&
    matchedSection.type === 'markdown' &&
    matchedSection.frontmatter.hideHeader;

  const shouldHideSidebar =
    !matchedSection ||
    (matchedSection &&
      matchedSection.type === 'markdown' &&
      matchedSection.frontmatter.hideSidebar);

  return (
    <Wrapper>
      <IdProvider>
        <div className={colorTheme}>
          <QueryParamProvider>
            <CodeThemeContext.Provider value={THEME.codeTheme}>
              <Div
                css={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {!shouldHideHeader && <Header />}
                <Div css={{ display: 'flex', flex: 1 }}>
                  {!shouldHideSidebar && <Sidebar sections={sections} />}
                  <Suspense fallback={null}>
                    <Switch>
                      {routes.map(function dataToRoute(route) {
                        if (!route) {
                          return null;
                        }

                        const Ui = route.ui;

                        return (
                          <Route
                            path={route.path}
                            exact={route.exact}
                            key={route.path}
                          >
                            {Array.isArray(Ui) ? Ui.map(dataToRoute) : <Ui />}
                          </Route>
                        );
                      })}
                      <Route path="/" exact>
                        <DefaultHomePage />
                      </Route>
                    </Switch>
                  </Suspense>
                </Div>
              </Div>
            </CodeThemeContext.Provider>
          </QueryParamProvider>
        </div>
      </IdProvider>
    </Wrapper>
  );
};
