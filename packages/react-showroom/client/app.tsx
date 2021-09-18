import { IdProvider } from '@radix-ui/react-id';
import { Route, Switch, useLocation } from '@showroomjs/bundles/routing';
import { css, QueryParamProvider } from '@showroomjs/ui';
import cx from 'classnames';
import * as React from 'react';
import sections from 'react-showroom-sections';
import Wrapper from 'react-showroom-wrapper';
import { CodeThemeContext } from './lib/code-theme-context';
import { SubRootRoute } from './lib/routing';
import { ComponentDocRoute } from './pages/component-doc-route';
import { DefaultHomePage } from './pages/index';
import { MarkdownRoute } from './pages/markdown-route';
import { colorTheme, THEME } from './theme';

export const App = () => {
  const location = useLocation();

  React.useEffect(() => {
    const hashMatch = location.hash;

    if (hashMatch) {
      const hashTarget = document.getElementById(hashMatch.replace('^#', ''));

      if (hashTarget) {
        let isCurrent = true;

        import(
          /* webpackPrefetch: true */
          'scroll-into-view-if-needed'
        ).then((scroll) => {
          if (isCurrent) {
            scroll.default(hashTarget);
          }
        });

        return () => {
          isCurrent = false;
        };
      }
    }
  }, [location]);

  return (
    <Wrapper>
      <IdProvider>
        <div className={cx(colorTheme, wrapper())}>
          <QueryParamProvider>
            <CodeThemeContext.Provider value={THEME.codeTheme}>
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
                      <SubRootRoute
                        path={`/${section.slug}`}
                        key={section.slug}
                      >
                        <ComponentDocRoute section={section} />
                      </SubRootRoute>
                    );
                  }

                  if (section.type === 'markdown') {
                    return (
                      <SubRootRoute
                        path={`/${section.slug}`}
                        exact={section.slug === ''}
                        key={section.slug}
                      >
                        <MarkdownRoute section={section} />
                      </SubRootRoute>
                    );
                  }

                  return null;
                })}
                <Route path="/" exact>
                  <DefaultHomePage />
                </Route>
              </Switch>
            </CodeThemeContext.Provider>
          </QueryParamProvider>
        </div>
      </IdProvider>
    </Wrapper>
  );
};

const wrapper = css({
  height: '100%',
});
