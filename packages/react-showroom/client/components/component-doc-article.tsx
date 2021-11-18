import type { ReactShowroomComponentContent } from '@showroomjs/core/react';
import * as React from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';
import DocPlaceholder from 'react-showroom-doc-placeholder';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';
import { Div } from './base';
import { TableOfContent } from './table-of-content';

export const ComponentDocArticle = (props: {
  slug: string;
  content: ReactShowroomComponentContent;
  metadata: ComponentDoc;
}) => {
  const { doc: Doc, headings } = props.content;

  const hasHeadings = headings && headings.length > 0;

  return (
    <Div
      css={
        hasHeadings
          ? {
              '@xl': {
                display: 'flex',
                flexDirection: 'row-reverse',
              },
            }
          : undefined
      }
    >
      {hasHeadings && <TableOfContent headings={headings} />}
      <Article
        css={
          hasHeadings
            ? {
                '@xl': {
                  width: '75%',
                },
              }
            : undefined
        }
      >
        <ComponentMeta
          componentData={props.metadata}
          slug={props.slug}
          propsDefaultOpen
        />
        {Doc ? (
          <Doc components={mdxComponents} />
        ) : (
          <DocPlaceholder componentFilePath={props.metadata.filePath} />
        )}
      </Article>
    </Div>
  );
};
