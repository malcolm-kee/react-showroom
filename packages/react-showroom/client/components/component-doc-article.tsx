import type { ReactShowroomComponentSection } from '@showroomjs/core/react';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactShowroomComponentSection;
}) => {
  const { doc: Doc, component } = props.doc.data;

  return (
    <Article>
      <ComponentMeta componentData={component} propsDefaultOpen={!Doc} />
      {Doc && <Doc components={mdxComponents} />}
    </Article>
  );
};
