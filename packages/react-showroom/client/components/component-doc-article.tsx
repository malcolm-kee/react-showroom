import type { ReactShowroomComponentContent } from '@showroomjs/core/react';
import * as React from 'react';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  slug: string;
  content: ReactShowroomComponentContent;
}) => {
  const { doc: Doc, metadata } = props.content;

  return (
    <Article>
      <ComponentMeta
        componentData={metadata}
        slug={props.slug}
        propsDefaultOpen={!Doc}
      />
      {Doc && <Doc components={mdxComponents} />}
    </Article>
  );
};
