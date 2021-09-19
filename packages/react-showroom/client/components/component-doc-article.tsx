import type { ReactShowroomComponentSection } from '@showroomjs/core/react';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactShowroomComponentSection;
}) => {
  const { doc: Doc } = props.doc.data;

  return (
    <Article>
      <ComponentMeta
        componentData={props.doc.data.component}
        slug={props.doc.slug}
        propsDefaultOpen={!Doc}
      />
      {Doc && <Doc components={mdxComponents} />}
    </Article>
  );
};
