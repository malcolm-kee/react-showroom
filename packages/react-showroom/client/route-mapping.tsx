import { matchPath } from '@showroomjs/bundles/routing';
import type { ReactShowroomSection } from '@showroomjs/core/react';
import * as React from 'react';
import sections from 'react-showroom-sections';
import { lazy } from './lib/lazy';

const mapping: Array<{
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
  exact: boolean;
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
      path: `/${section.slug}`,
      exact: section.slug === '',
      ui: section.items.map(mapSectionToRoute),
    };
  }

  if (section.type === 'component') {
    const componentSection = section;

    const load = () =>
      Promise.all([
        section.data.load(),
        import('./pages/component-doc-route'),
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

    return {
      path: `/${section.slug}`,
      exact: false,
      ui: lazy(load),
      load,
    };
  }

  if (section.type === 'markdown') {
    const markdownSection = section;

    const load = () =>
      Promise.all([section.load(), import('./pages/markdown-route')]).then(
        ([sectionData, { MarkdownRoute }]) => {
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
        }
      );

    return {
      path: `/${section.slug}`,
      exact: section.slug === '',
      ui: lazy(load),
      load,
    };
  }

  return null;
});

const loaded = new Set<string>();

export const loadCodeAtPath = (path: string): Promise<void> => {
  if (loaded.has(path)) {
    return Promise.resolve();
  }

  let pathname = path;

  if (pathname[pathname.length - 1] === '/') {
    pathname = pathname.substring(0, pathname.length - 1);
  }

  const matchSection = (function () {
    const routeItems = routes.slice().reverse();

    for (const mapping of routeItems) {
      if (!mapping) {
        continue;
      }

      if (Array.isArray(mapping.ui)) {
        routeItems.push(...mapping.ui);
        continue;
      }

      const match = matchPath(pathname, {
        path: mapping.path,
        exact: true,
      });

      if (match) {
        return mapping;
      }
    }
  })();

  return matchSection && matchSection.load
    ? matchSection.load().then(() => {
        loaded.add(path);
      })
    : Promise.resolve();
};
