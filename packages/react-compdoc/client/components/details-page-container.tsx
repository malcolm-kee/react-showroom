import * as React from 'react';
import { Div } from './base';
import { Header } from './header';
import { Seo } from './seo';

export interface DetailsPageContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => {
  return (
    <>
      <Seo title={props.title} />
      <Header />
      <Div
        css={{
          maxWidth: '$screen2Xl',
          marginX: 'auto',
          px: '$6',
        }}
      >
        {props.children}
      </Div>
    </>
  );
};
