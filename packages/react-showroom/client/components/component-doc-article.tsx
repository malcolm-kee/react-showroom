import type { ReactShowroomComponentContent } from '@showroomjs/core/react';
import { tw } from '@showroomjs/ui';
import type { ComponentDoc } from 'react-docgen-typescript';
import DocPlaceholder from 'react-showroom-doc-placeholder';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';
import { TableOfContent } from './table-of-content';

export const ComponentDocArticle = (props: {
  slug: string;
  content: ReactShowroomComponentContent;
  metadata: ComponentDoc;
}) => {
  const { doc: Doc, headings, editUrl } = props.content;

  const hasSideContent = (headings && headings.length > 0) || editUrl;

  return (
    <div className={tw([hasSideContent && 'xl:flex xl:flex-row-reverse'])}>
      {hasSideContent ? (
        <TableOfContent headings={headings} editUrl={editUrl} />
      ) : null}
      <Article className={tw(['px-4', hasSideContent && 'xl:w-3/4'])}>
        <div className={tw(['mb-12'])}>
          <ComponentMeta
            componentData={props.metadata}
            slug={props.slug}
            propsDefaultOpen
          />
        </div>
        {Doc ? (
          <Doc components={mdxComponents} />
        ) : (
          <DocPlaceholder componentFilePath={props.metadata.filePath} />
        )}
      </Article>
    </div>
  );
};
