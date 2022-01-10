import {
  DocumentIcon,
  ExternalLinkIcon,
  PuzzleIcon,
} from '@heroicons/react/outline';
import { HashtagIcon } from '@heroicons/react/solid';
import type { SearchIndexItem } from '@showroomjs/core/react';
import type { Option } from '@showroomjs/ui';
import { styled } from '@showroomjs/ui';
import * as React from 'react';
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
            icon: <Puzzle width={20} height={20} />,
          });

          if (item.headings) {
            item.headings.forEach((heading) => {
              if (heading.slug) {
                headingOptions.push({
                  label: heading.text,
                  value: `/${item.slug}#${heading.slug}`,
                  description: item.title,
                  icon: <Hashtag width={20} height={20} />,
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
              icon: <Document width={20} height={20} />,
            });
            item.headings.forEach((heading) => {
              if (heading.slug) {
                headingOptions.push({
                  label: heading.text,
                  value: `/${item.slug}#${heading.slug}`,
                  description: title,
                  icon: <Hashtag width={20} height={20} />,
                });
              }
            });
          }
          break;

        case 'group':
          innerCollect(item.items);
          break;

        case 'link':
          mainOptions.push({
            label: item.title,
            value: item.href,
            icon: <External width={20} height={20} />,
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

const Document = styled(DocumentIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

const Hashtag = styled(HashtagIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

const Puzzle = styled(PuzzleIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

const External = styled(ExternalLinkIcon, {
  width: 20,
  height: 20,
  color: 'inherit',
});

export const options = collectOptions(rawIndex);
