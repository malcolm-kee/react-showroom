import * as React from 'react';
import { Div } from './base';
import { Header } from './header';
import { Seo } from './seo';
import { Sidebar } from './sidebar';
import sections from 'react-compdoc-sections';

export interface DetailsPageContainerProps {
  children: React.ReactNode;
  title?: string;
  hideSidebar?: boolean;
  hideHeader?: boolean;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => {
  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Seo title={props.title} />
      {!props.hideHeader && <Header />}
      <Div css={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {!props.hideSidebar && <Sidebar sections={sections} />}
        <Div
          as="main"
          css={{
            flex: '1',
            overflowY: 'auto',
          }}
        >
          {props.hideSidebar ? (
            props.children
          ) : (
            <Div
              css={{
                maxWidth: '$screen2Xl',
                marginX: 'auto',
                px: '$6',
              }}
            >
              {props.children}
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
};
