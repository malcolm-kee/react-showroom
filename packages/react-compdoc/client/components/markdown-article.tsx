import { ReactCompdocMarkdownSection } from '@compdoc/core';
import React from 'react';
import { Article } from './article';
import { mdxComponents, MdxContextProvider } from './mdx-components';

export const MarkdownArticle = (props: {
  section: ReactCompdocMarkdownSection;
  showLinkToDetails?: boolean;
}) => {
  const {
    section: { Component, title, slug },
  } = props;

  return (
    <Article>
      <MdxContextProvider
        value={React.useMemo(
          () => ({
            titleSlug: slug,
            title,
            showLinkToDetails: props.showLinkToDetails,
          }),
          [title, slug, props.showLinkToDetails]
        )}
      >
        <Component components={mdxComponents} />
      </MdxContextProvider>
    </Article>
  );
};
