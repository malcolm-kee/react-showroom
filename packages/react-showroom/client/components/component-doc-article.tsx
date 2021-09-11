import type { ReactShowroomComponentSection } from '@showroomjs/core/react';
import { ComponentDataContext } from '../lib/component-data-context';
import { ComponentPropsContext } from '../lib/component-props-context';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactShowroomComponentSection;
}) => {
  const { doc: Doc } = props.doc.data;

  return (
    <Article>
      <ComponentPropsContext.Provider value={props.doc.data.component.props}>
        <ComponentMeta section={props.doc} propsDefaultOpen={!Doc} />
        {Doc && (
          <ComponentDataContext.Provider value={props.doc.data}>
            <Doc components={mdxComponents} />
          </ComponentDataContext.Provider>
        )}
      </ComponentPropsContext.Provider>
    </Article>
  );
};
