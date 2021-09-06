import type { ReactCompdocComponentSection } from '@compdoc/core';
import { styled } from '../stitches.config';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactCompdocComponentSection;
}) => {
  const { doc: Doc } = props.doc.data;

  return (
    <Article>
      <ComponentMeta section={props.doc} propsDefaultOpen={!Doc} />
      {Doc && <Doc components={mdxComponents} />}
    </Article>
  );
};

const Article = styled('article', {
  py: '$6',
  marginBottom: '$12',
  borderBottom: '1px solid',
  borderBottomColor: '$gray-200',
});
