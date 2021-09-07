import type { ReactCompdocComponentSection } from '@compdoc/core';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactCompdocComponentSection;
  showLinkToDetailsPage?: boolean;
}) => {
  const { doc: Doc } = props.doc.data;

  return (
    <Article>
      <ComponentMeta
        section={props.doc}
        propsDefaultOpen={!Doc}
        showLinkToDetails={props.showLinkToDetailsPage}
      />
      {Doc && <Doc components={mdxComponents} />}
    </Article>
  );
};
