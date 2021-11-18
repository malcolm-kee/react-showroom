import { ReactShowroomMarkdownContent } from '@showroomjs/core/react';
import * as React from 'react';
import { Article } from './article';
import { Div } from './base';
import { mdxComponents } from './mdx-components';
import { TableOfContent } from './table-of-content';

export const MarkdownArticle = (props: {
  slug: string;
  showLinkToDetails?: boolean;
  center?: boolean;
  content: ReactShowroomMarkdownContent;
}) => {
  const {
    slug,
    content: { Component, headings },
  } = props;

  const hasHeadings = headings && headings.length > 0 && slug !== '';

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
        center={props.center}
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
        <Component components={components} />
      </Article>
    </Div>
  );
};

const { code: Code } = mdxComponents;

const components = {
  ...mdxComponents,
  code: function CustomCode({
    live,
    static: staticValue = !live,
    ...props
  }: React.ComponentPropsWithoutRef<typeof Code> & {
    live?: boolean;
  }) {
    return <Code static={staticValue} {...props} />;
  },
};
