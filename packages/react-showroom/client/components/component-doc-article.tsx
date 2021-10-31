import type { ReactShowroomComponentContent } from '@showroomjs/core/react';
import * as React from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';
import DocPlaceholder from 'react-showroom-doc-placeholder';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  slug: string;
  content: ReactShowroomComponentContent;
  metadata: ComponentDoc;
}) => {
  const { doc: Doc } = props.content;

  return (
    <Article>
      <ComponentMeta
        componentData={props.metadata}
        slug={props.slug}
        propsDefaultOpen={!Doc}
      />
      {Doc ? (
        <Doc components={mdxComponents} />
      ) : (
        <DocPlaceholder componentFilePath={props.metadata.filePath} />
      )}
    </Article>
  );
};
