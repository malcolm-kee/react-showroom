import type { ReactCompdocComponentSection } from '@compdoc/core';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactCompdocComponentSection;
  mode: 'standalone' | 'embedded';
}) => {
  const { doc: Doc } = props.doc.data;

  return (
    <Article>
      <ComponentMeta section={props.doc} propsDefaultOpen={!Doc} />
      {Doc && <Doc components={mdxComponents} />}
    </Article>
  );
};
