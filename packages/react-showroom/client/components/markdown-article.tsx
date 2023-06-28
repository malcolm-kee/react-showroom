import type { ReactShowroomMarkdownContent } from '@showroomjs/core/react';
import { tw } from '@showroomjs/ui';
import * as React from 'react';
import { Article } from './article';
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
    content: { Component, headings, editUrl },
  } = props;

  const hasSideContent =
    ((headings && headings.length > 0) || editUrl) && slug !== '';

  return (
    <div
      className={tw([
        'px-6',
        hasSideContent && 'xl:flex xl:flex-row-reverse xl:gap-6 xl:pr-0',
      ])}
    >
      {hasSideContent ? (
        <TableOfContent headings={headings} editUrl={editUrl} />
      ) : null}
      <Article
        center={props.center}
        className={hasSideContent ? tw(['xl:w-3/4']) : undefined}
      >
        <Component components={components} />
      </Article>
    </div>
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
