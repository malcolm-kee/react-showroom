import type { ReactShowroomComponentContent } from '@showroomjs/core/react';
import * as React from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ComponentDoc;
  slug: string;
  content: ReactShowroomComponentContent;
}) => {
  const { doc: Doc } = props.content;

  return (
    <Article>
      <ComponentMeta
        componentData={props.doc}
        slug={props.slug}
        propsDefaultOpen={!Doc}
      />
      {Doc && <Doc components={mdxComponents} />}
    </Article>
  );
};
