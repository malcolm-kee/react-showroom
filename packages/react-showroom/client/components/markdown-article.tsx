import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import { Article } from './article';
import { mdxComponents } from './mdx-components';

export const MarkdownArticle = (props: {
  section: ReactShowroomMarkdownSection;
  showLinkToDetails?: boolean;
  center?: boolean;
}) => {
  const {
    section: { Component },
  } = props;

  return (
    <Article center={props.center}>
      <Component components={mdxComponents} />
    </Article>
  );
};
