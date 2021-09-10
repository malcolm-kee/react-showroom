import type { ReactCompdocComponentSection } from '@compdoc/core';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';
import { ComponentDataContext } from '../lib/component-data-context';

export const ComponentDocArticle = (props: {
  doc: ReactCompdocComponentSection;
}) => {
  const { doc: Doc } = props.doc.data;

  return (
    <Article>
      <ComponentMeta section={props.doc} propsDefaultOpen={!Doc} />
      {Doc && (
        <ComponentDataContext.Provider value={props.doc.data}>
          <Doc components={mdxComponents} />
        </ComponentDataContext.Provider>
      )}
    </Article>
  );
};
