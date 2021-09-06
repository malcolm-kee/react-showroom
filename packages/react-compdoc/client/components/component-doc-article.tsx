import type { ComponentDocItem } from '@compdoc/core';
import { styled } from '../stitches.config';
import { Code, Pre } from './code-block';
import { ComponentMeta } from './component-meta';

const components = {
  pre: Pre,
  code: Code,
  p: styled('p', {
    marginY: '$3',
  }),
};

export const ComponentDocArticle = (props: { doc: ComponentDocItem }) => {
  const { component, doc: Doc } = props.doc;

  return (
    <Article>
      <ComponentMeta doc={component} propsDefaultOpen={!Doc} />
      {Doc && <Doc components={components} />}
    </Article>
  );
};

const Article = styled('article', {
  py: '$6',
  marginBottom: '$12',
  borderBottom: '1px solid',
  borderBottomColor: '$gray-200',
});
