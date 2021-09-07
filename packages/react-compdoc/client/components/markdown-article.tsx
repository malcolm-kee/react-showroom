import { ReactCompdocMarkdownSection } from '@compdoc/core';
import { Article } from './article';
import { mdxComponents } from './mdx-components';

export const MarkdownArticle = (props: {
  section: ReactCompdocMarkdownSection;
}) => {
  const {
    section: { Component },
  } = props;

  return (
    <Article>
      <Component components={mdxComponents} />
    </Article>
  );
};
