import * as React from 'react';
import sections from 'react-showroom-sections';
import { Div } from './base';
import { Header } from './header';
import { Seo } from './seo';
import { Sidebar } from './sidebar';

export interface DetailsPageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  hideSidebar?: boolean;
  hideHeader?: boolean;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => {
  return (
    <>
      <Seo title={props.title} description={props.description} />
      {!props.hideHeader && <Header />}
      <Div css={{ display: 'flex' }}>
        {!props.hideSidebar && <Sidebar sections={sections} />}
        <Div
          as="main"
          css={{
            flex: '1',
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
      </Div>
    </>
  );
};
