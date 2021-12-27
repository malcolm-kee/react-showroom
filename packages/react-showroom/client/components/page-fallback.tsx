import { css, pulse, styled } from '@showroomjs/ui';
import * as React from 'react';
import { Article } from './article';
import { Div as Base } from './base';
import { DetailsPageContainer } from './details-page-container';
import { mdxComponents } from './mdx-components';

const { h1: Heading, p: P, h2: Subheading } = mdxComponents;

export const PageFallback = (props: { title?: string }) => {
  return (
    <DetailsPageContainer title={props.title}>
      <Article>
        <Heading className={pulseCs()}>
          {props.title || (
            <Div
              css={{
                width: '50%',
                height: '3.75rem',
              }}
            />
          )}
        </Heading>
        <Text
          css={{
            width: '70%',
          }}
        />
        <CodeBlockSkeleton />
        <Text
          css={{
            width: '40%',
          }}
        />
        <Subheading>
          <Div
            css={{
              width: '30%',
              height: '2.25rem',
            }}
            className={pulseCs()}
          />
        </Subheading>
        <Text />
        <Text />
        <Text
          css={{
            width: '50%',
          }}
        />
        <Subheading>
          <Div
            css={{
              width: '40%',
              height: '2.25rem',
            }}
            className={pulseCs()}
          />
        </Subheading>
        <Text
          css={{
            width: '70%',
          }}
        />
        <CodeBlockSkeleton />
        <Text
          css={{
            width: '40%',
          }}
        />
      </Article>
    </DetailsPageContainer>
  );
};

const pulseCs = css({
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

const Div = styled('div', {
  backgroundColor: '$gray-200',
});

const Text = styled(P, {
  height: '1rem',
  backgroundColor: '$gray-200',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

const CodeBlockSkeleton = () => {
  return (
    <Base
      css={{
        marginTop: '$4',
        marginBottom: '$8',
      }}
    >
      <Base
        css={{
          minHeight: 48,
          border: '1px solid',
          borderColor: '$gray-300',
          padding: '$2',
        }}
      >
        <Base
          css={{
            display: 'flex',
            gap: '$4',
            justifyContent: 'center',
          }}
        >
          <Div
            css={{
              width: 100,
              height: '2rem',
            }}
            className={pulseCs()}
          />
          <Div
            css={{
              width: 100,
              height: '2rem',
            }}
            className={pulseCs()}
          />
        </Base>
      </Base>
    </Base>
  );
};
