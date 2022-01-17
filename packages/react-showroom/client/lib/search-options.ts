import type { SearchIndexItem } from '@showroomjs/core/react';
import type { Option } from '@showroomjs/ui';
import rawIndex from 'react-showroom-index';

function collectOptions(indexItems: SearchIndexItem[]) {
  const mainOptions: Array<Option<string>> = [];
  const headingOptions: Array<Option<string>> = [];

  function innerCollect(items: SearchIndexItem[]) {
    items.forEach((item) => {
      switch (item.type) {
        case 'component':
          mainOptions.push({
            label: item.title,
            value: `/${item.slug}`,
            description: item.description,
            icon: 'component',
          });

          if (item.headings) {
            item.headings.forEach((heading) => {
              if (heading.slug) {
                headingOptions.push({
                  label: heading.text,
                  value: `/${item.slug}#${heading.slug}`,
                  description: item.title,
                  icon: 'section',
                });
              }
            });
          }
          break;

        case 'markdown':
          const title = item.formatLabel(
            item.frontmatter.title || item.fallbackTitle
          );
          if (item.slug && title) {
            mainOptions.push({
              label: title,
              value: `/${item.slug}`,
              description: item.frontmatter.description,
              icon: 'markdown',
            });
            if (item.headings) {
              item.headings.forEach((heading) => {
                if (heading.slug) {
                  headingOptions.push({
                    label: heading.text,
                    value: `/${item.slug}#${heading.slug}`,
                    description: title,
                    icon: 'section',
                  });
                }
              });
            }
          }
          break;

        case 'group':
          innerCollect(item.items);
          break;

        case 'link':
          mainOptions.push({
            label: item.title,
            value: item.href,
            icon: 'link',
          });
          break;

        default:
          break;
      }
    });
  }

  innerCollect(indexItems);

  return mainOptions.concat(headingOptions);
}

export const options = collectOptions(rawIndex);
