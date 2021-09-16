import type { ReactShowroomComponentSection } from '@showroomjs/core/react';
import * as React from 'react';
import { CodeImportsContextProvider } from '../lib/code-imports-context';
import { CodeVariablesContextProvider } from '../lib/code-variables-context';
import { ComponentDataContext } from '../lib/component-data-context';
import { ComponentPropsContext } from '../lib/component-props-context';
import { Article } from './article';
import { ComponentMeta } from './component-meta';
import { mdxComponents } from './mdx-components';

export const ComponentDocArticle = (props: {
  doc: ReactShowroomComponentSection;
}) => {
  const { doc: Doc, component, imports } = props.doc.data;

  const codeVariables = React.useMemo(() => {
    if (component.displayName && component.Component) {
      return {
        [component.displayName]: component.Component,
      };
    }
    return {};
  }, [component]);

  return (
    <Article>
      <CodeImportsContextProvider value={imports}>
        <ComponentPropsContext.Provider value={component.props}>
          <ComponentMeta componentData={component} propsDefaultOpen={!Doc} />
          {Doc && (
            <CodeVariablesContextProvider value={codeVariables}>
              <ComponentDataContext.Provider value={props.doc.data}>
                <Doc components={mdxComponents} />
              </ComponentDataContext.Provider>
            </CodeVariablesContextProvider>
          )}
        </ComponentPropsContext.Provider>
      </CodeImportsContextProvider>
    </Article>
  );
};
