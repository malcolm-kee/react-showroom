import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import { Article } from './article';
import { mdxComponents } from './mdx-components';

export const MarkdownArticle = (props: {
  section: ReactShowroomMarkdownSection;
  showLinkToDetails?: boolean;
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
