import * as React from 'react';
import { Div } from './base';
import { Seo } from './seo';

export interface DetailsPageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => {
  return (
    <>
      <Seo title={props.title} description={props.description} />
      <Div
        as="main"
        css={{
          flex: '1',
          minWidth: 0,
          paddingBottom: '$12',
        }}
      >
        <Div
          css={{
            maxWidth: '$screen2Xl',
            marginX: 'auto',
            px: '$6',
          }}
        >
          {props.children}
        </Div>
      </Div>
    </>
  );
};
