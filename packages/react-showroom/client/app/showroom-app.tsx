import {
  IsClientContextProvider,
  NotificationProvider,
  QueryParamProvider,
  theme,
} from '@showroomjs/ui';
import * as React from 'react';
import sections from 'react-showroom-sections';
import Wrapper from 'react-showroom-wrapper';
import { Div } from '../components/base';
import { Header } from '../components/header';
import { PageFallback } from '../components/page-fallback';
import { Sidebar } from '../components/sidebar';
import { CodeThemeContext } from '../lib/code-theme-context';
import { Suspense } from '../lib/lazy';
import { matchPath, Route, Switch, useLocation } from '../lib/routing';
import { getScrollFn } from '../lib/scroll-into-view';
import { MenuContextProvider } from '../lib/use-menu';
import { useSize } from '../lib/use-size';
import { TargetAudienceProvider } from '../lib/use-target-audience';
import { DefaultHomePage } from '../pages/index';
import { routeMapping, routes } from '../route-mapping';
import { colorTheme, THEME } from '../theme';

export const ShowroomApp = () => {
  const location = useLocation();

  const lastPathName = React.useRef(location.pathname);

  React.useEffect(() => {
    const hashMatch = location.hash;

    if (hashMatch) {
      const hashTarget = document.getElementById(hashMatch.replace(/^#/, ''));

      if (hashTarget) {
        let isCurrent = true;

        getScrollFn().then((scroll) => {
          if (isCurrent) {
            scroll(hashTarget, {
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

  const matchedTitle = React.useMemo(() => {
    if (matchedSection) {
      if (matchedSection.type === 'component') {
        return matchedSection.title;
      }
      if (matchedSection.type === 'markdown') {
        return matchedSection.frontmatter.title || matchedSection.fallbackTitle;
      }
    }
  }, [matchedSection]);

  const shouldHideHeader =
    matchedSection &&
    matchedSection.type === 'markdown' &&
    matchedSection.frontmatter.hideHeader;

  const shouldHideSidebar =
    !matchedSection ||
    (matchedSection &&
      matchedSection.type === 'markdown' &&
      matchedSection.frontmatter.hideSidebar);

  const headerRef = React.useRef<HTMLElement>(null);

  const headerSize = useSize(headerRef);

  const cssVariables = headerSize
    ? ({
        '--header-height': `${headerSize.height}px`,
      } as React.CSSProperties)
    : undefined;

  return (
    <Wrapper>
      {/* we couldn't use :target selector as it doesn't work nicely with SPA */}
      {location.hash && (
        <style>{`${location.hash} {
        color: ${theme.colors['primary-800'].value};
      }`}</style>
      )}
      <IsClientContextProvider>
        <NotificationProvider>
          <TargetAudienceProvider>
            <Div className={colorTheme}>
              <QueryParamProvider>
                <CodeThemeContext.Provider value={THEME.codeTheme}>
                  <MenuContextProvider sections={sections}>
                    <Div style={cssVariables}>
                      {!shouldHideHeader && <Header ref={headerRef} />}
                      <Div css={{ display: 'flex' }}>
                        {!shouldHideSidebar && <Sidebar sections={sections} />}
                        <Suspense
                          fallback={<PageFallback title={matchedTitle} />}
                        >
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
                                  {Array.isArray(Ui) ? (
                                    Ui.map(dataToRoute)
                                  ) : (
                                    <Ui />
                                  )}
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
                  </MenuContextProvider>
                </CodeThemeContext.Provider>
              </QueryParamProvider>
            </Div>
          </TargetAudienceProvider>
        </NotificationProvider>
      </IsClientContextProvider>
    </Wrapper>
  );
};
