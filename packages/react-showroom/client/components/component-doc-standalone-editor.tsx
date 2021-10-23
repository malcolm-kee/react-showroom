import { ReactShowroomComponentContent } from '@showroomjs/core/react';
import { Breadcrumbs } from '@showroomjs/ui';
import * as React from 'react';
import { useComponentMeta } from '../lib/component-props-context';
import { useExampleRoot } from '../lib/example-root-context';
import { lazy } from '../lib/lazy';
import { Div } from './base';

const StandaloneEditor = lazy(() => import('./standalone-editor-lazy'));

export const ComponentDocStandaloneEditor = () => {
  const exampleRoot = useExampleRoot();
  const componentMetadata = useComponentMeta();

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: componentMetadata ? componentMetadata.displayName : '??',
            url: exampleRoot,
          },
          {
            label: 'Example',
          },
        ]}
      />
      <Div css={{ flex: 1 }}>
        <StandaloneEditor />
      </Div>
    </>
  );
};
