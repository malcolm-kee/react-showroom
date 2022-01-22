import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { styled } from '@showroomjs/ui';
import * as React from 'react';
import { Div, H1 } from '../components/base';
import { Seo } from '../components/seo';

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
        <Div
          as="main"
          css={{
            flex: '1',
            overflowY: 'auto',
            paddingTop: '10vh',
          }}
        >
          <Div
            css={{
              maxWidth: '$screenXl',
              marginX: 'auto',
              padding: '$6',
            }}
          >
            <H1
              css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '$4',
              }}
            >
              <OfflineIcon width={56} height={56} aria-hidden />
              Offline
            </H1>
            <Div
              as="p"
              css={{
                textAlign: 'center',
                '@sm': {
                  fontSize: '$xl',
                  lineHeight: '$xl',
                },
              }}
            >
              Please try again later.
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

const OfflineIcon = styled(ExclamationCircleIcon, {
  width: 40,
  height: 40,
  display: 'inline-block',
  color: '$gray-400',
  '@sm': {
    width: 56,
    height: 56,
  },
});
