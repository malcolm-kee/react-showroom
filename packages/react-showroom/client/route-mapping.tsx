import { matchPath, PathMatch } from '@showroomjs/bundles/routing';
import type { ReactShowroomSection } from '@showroomjs/core/react';
import * as React from 'react';
import sections from 'react-showroom-sections';
import { lazy } from './lib/lazy';

const mapping: Array<{
  path: string;
  section: ReactShowroomSection;
}> = [];

export let hasCustomHomePage = false;

(function collectMapping(sectionItems: Array<ReactShowroomSection>) {
  sectionItems.forEach((section) => {
    switch (section.type) {
      case 'group':
        collectMapping(section.items);
        break;

      case 'component':
      case 'markdown':
        if (!section.slug) {
          hasCustomHomePage = true;
        }

        mapping.push({
          path: `/${section.slug}`,
          section,
        });
        break;

      default:
        break;
    }
  });
})(sections);

export const routeMapping = mapping;

export interface RouteData {
  path: string;
  ui: Array<RouteData | null> | React.ComponentType<any>;
  load?: () => Promise<unknown>;
}

export const routes = sections.map(function mapSectionToRoute(
  section
): RouteData | null {
  if (section.type === 'link') {
    return null;
  }

  if (section.type === 'group') {
    return {
      path: section.slug ? `/${section.slug}/*` : '*',
      ui: section.items.map(mapSectionToRoute),
    };
  }

  if (section.type === 'component') {
    const componentSection = section;

    const load = () =>
      Promise.all([
        section.data.load(),
        import(
          /* webpackChunkName: "componentDocRoute" */ './pages/component-doc-route'
        ),
      ]).then(([componentData, { ComponentDocRoute }]) => {
        function LazyComponentRoute() {
          return (
            <ComponentDocRoute
              section={componentSection}
              content={componentData}
            />
          );
        }

        return {
          default: LazyComponentRoute,
        };
      });

    const ui = lazy(load);

    return {
      path: `/${section.slug}/*`,
      ui,
      load: 'preload' in ui ? ui.preload : load,
    };
  }

  if (section.type === 'markdown') {
    const markdownSection = section;

    const load = () =>
      Promise.all([
        section.load(),
        import(
          /* webpackChunkName: "markdownRoute" */
          './pages/markdown-route'
        ),
      ]).then(([sectionData, { MarkdownRoute }]) => {
        function LazyMarkdownRoute() {
          return (
            <MarkdownRoute
              section={markdownSection}
              content={sectionData}
              title={
                markdownSection.frontmatter.title ||
                markdownSection.fallbackTitle
              }
            />
          );
        }

        return {
          default: LazyMarkdownRoute,
        };
      });

    const ui = lazy(load);

    return {
      path: section.slug ? `/${section.slug}/*` : '*',
      ui,
      load: 'preload' in ui ? ui.preload : load,
    };
  }

  return null;
});

const loaded = new Set<string>();
const loadPromiseMap = new Map<string, Promise<void>>();

function noop() {}

export const loadCodeAtPath = (
  fullPath: string,
  onLoad: () => void = noop
): void => {
  console.log({ fullPath });

  const hashIndex = fullPath.indexOf('#');
  const path = hashIndex > 0 ? fullPath.slice(0, hashIndex) : fullPath;

  if (loaded.has(path)) {
    onLoad();
    return;
  }

  const prevPromise = loadPromiseMap.get(path);

  if (prevPromise) {
    prevPromise.then(onLoad);
    return;
  }

  let pathname = path;

  if (pathname !== '/' && pathname[pathname.length - 1] === '/') {
    pathname = pathname.substring(0, pathname.length - 1);
  }

  const matchedSection = (function (): RouteData | undefined {
    const matches: Array<{
      match: PathMatch;
      mapping: RouteData;
    }> = [];

    const routeItems = routes.slice();

    for (const mapping of routeItems) {
      if (!mapping) {
        continue;
      }

      if (Array.isArray(mapping.ui)) {
        routeItems.push(...mapping.ui);
        continue;
      }

      const match = matchPath(mapping.path, pathname);

      if (match) {
        matches.push({
          match,
          mapping,
        });
      }
    }

    if (matches.length > 1) {
      // when more than one match, need to guess the matched route
      // here just assume '*' is lowest priority, then the longer the pattern the more specific it is
      const selectedMatch = matches.reduce((prevItem, item) => {
        const prevMatch = prevItem.match.pattern;
        const currentMatch = item.match.pattern;

        if (prevMatch.path === '*') {
          return item;
        }

        if (currentMatch.path === '*') {
          return prevItem;
        }

        return prevMatch.path.length > currentMatch.path.length
          ? prevItem
          : item;
      });

      return selectedMatch.mapping;
    } else {
      return matches[0] && matches[0].mapping;
    }
  })();

  if (!matchedSection || !matchedSection.load) {
    loaded.add(path);
    onLoad();
  } else {
    const loadResult = matchedSection.load().then(() => {
      loaded.add(path);
      loadPromiseMap.delete(path);
      onLoad();
    });

    loadPromiseMap.set(path, loadResult);
  }
};
