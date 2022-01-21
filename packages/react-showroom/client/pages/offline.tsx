import * as React from 'react';
import { Div, H1 } from '../components/base';
import { Seo } from '../components/seo';
import { Sidebar } from '../components/sidebar';
import sections from 'react-showroom-sections';

export const OfflinePage = () => {
  return (
    <Div
      css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
      }}
    >
      <Seo title="Offline" />
      <Div css={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar sections={sections} />
        <Div
          as="main"
          css={{
            flex: '1',
            overflowY: 'auto',
          }}
        >
          <Div
            css={{
              maxWidth: '$screenXl',
              marginX: 'auto',
              padding: '$6',
            }}
          >
            <H1>Offline</H1>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};
