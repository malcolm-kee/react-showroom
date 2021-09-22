import { IdProvider } from '@radix-ui/react-id';
import {
  matchPath,
  Route,
  Switch,
  useLocation,
} from '@showroomjs/bundles/routing';
import type { ReactShowroomSection } from '@showroomjs/core/react';
import { QueryParamProvider } from '@showroomjs/ui';
import * as React from 'react';
import sections from 'react-showroom-sections';
import Wrapper from 'react-showroom-wrapper';
import { Div } from './components/base';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';
import { CodeThemeContext } from './lib/code-theme-context';
import { ComponentDocRoute } from './pages/component-doc-route';
import { DefaultHomePage } from './pages/index';
import { MarkdownRoute } from './pages/markdown-route';
import { colorTheme, THEME } from './theme';

const routeMapping: Array<{
  path: string;
  section: ReactShowroomSection;
}> = [];

(function collectMapping(sections: Array<ReactShowroomSection>) {
  sections.forEach((section) => {
    switch (section.type) {
      case 'group':
        collectMapping(section.items);
        break;

      case 'component':
      case 'markdown':
        routeMapping.push({
          path: `/${section.slug}`,
          section,
        });
        break;

      default:
        break;
    }
  });
})(sections);

const routes = sections.map(function SectionRoute(section) {
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
        <ComponentDocRoute section={section} />
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
        <MarkdownRoute section={section} />
      </Route>
    );
  }

  return null;
});

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
                  <Switch>
                    {routes}
                    <Route path="/" exact>
                      <DefaultHomePage />
                    </Route>
                  </Switch>
                </Div>
              </Div>
            </CodeThemeContext.Provider>
          </QueryParamProvider>
        </div>
      </IdProvider>
    </Wrapper>
  );
};
