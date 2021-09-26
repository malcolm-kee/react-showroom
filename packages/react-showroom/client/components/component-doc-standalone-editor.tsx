import {
  ReactShowroomComponentContent,
  ReactShowroomComponentSection,
} from '@showroomjs/core/react';
import * as React from 'react';
import { Div } from './base';
import { ComponentMeta } from './component-meta';
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
      <Div css={{ px: '$4', paddingTop: '$6' }}>
        <ComponentMeta
          componentData={props.content.metadata}
          slug={props.slug}
        />
      </Div>
      <Div css={{ flex: 1 }}>
        <StandaloneEditor />
      </Div>
    </>
  );
};
