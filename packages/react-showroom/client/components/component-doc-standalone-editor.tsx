import { ReactShowroomComponentContent } from '@showroomjs/core/react';
import { Breadcrumbs } from '@showroomjs/ui';
import * as React from 'react';
import { Div } from './base';
import { StandaloneEditor } from './standalone-editor';

export interface ComponentDocStandaloneEditorProps {
  slug: string;
  content: ReactShowroomComponentContent;
}

export const ComponentDocStandaloneEditor = (
  props: ComponentDocStandaloneEditorProps
) => {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: props.content.metadata.displayName,
            url: `/${props.slug}`,
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
