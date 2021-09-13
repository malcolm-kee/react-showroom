import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import { styled, Collapsible } from '@showroomjs/ui';
import { Article } from './article';
import { Div } from './base';
import { mdxComponents } from './mdx-components';
import * as React from 'react';

export const MarkdownArticle = (props: {
  section: ReactShowroomMarkdownSection;
  showLinkToDetails?: boolean;
  center?: boolean;
}) => {
  const {
    section: { Component, headings },
  } = props;

  const hasHeadings = headings && headings.length > 0;

  const [submenuIsOpen, setSubmenuIsOpen] = React.useState<boolean | undefined>(
    false
  );

  return (
    <Div
      css={
        hasHeadings
          ? {
              '@lg': {
                display: 'flex',
                flexDirection: 'row-reverse',
              },
            }
          : undefined
      }
    >
      {hasHeadings && (
        <Div
          css={{
            '@lg': {
              px: '$6',
              width: '25%',
            },
          }}
        >
          <Collapsible.Root
            open={submenuIsOpen}
            onOpenChange={setSubmenuIsOpen}
            css={{
              py: '$3',
              borderRadius: '$md',
              overflow: 'hidden',
              '@lg': {
                display: 'none',
              },
            }}
          >
            <Collapsible.Button
              css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                py: '$2',
                px: '$4',
                backgroundColor: '$gray-100',
              }}
            >
              In this page
              <Collapsible.ToggleIcon
                hide={submenuIsOpen}
                aria-label={submenuIsOpen ? 'Hide' : 'View'}
                width="16"
                height="16"
              />
            </Collapsible.Button>
            <Collapsible.Content
              css={{
                backgroundColor: '$gray-50',
                px: '$2',
                paddingBottom: '$1',
              }}
            >
              <ul>
                {headings.map((heading, index) => (
                  <Item
                    css={{
                      paddingLeft: (heading.rank - 2) * 24,
                    }}
                    key={index}
                  >
                    <A href={`#${heading.id}`}>{heading.text}</A>
                  </Item>
                ))}
              </ul>
            </Collapsible.Content>
          </Collapsible.Root>
          <Div
            css={{
              display: 'none',
              '@lg': {
                display: 'block',
              },
              position: 'sticky',
              top: '$6',
              py: '$3',
              borderLeft: '1px solid $gray-300',
            }}
          >
            <Div
              css={{
                color: '$gray-400',
                paddingLeft: 16,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                marginBottom: '$2',
              }}
            >
              In this page
            </Div>
            <ul>
              {headings.map((heading, index) => (
                <Item
                  css={{
                    paddingLeft: 16 + (heading.rank - 2) * 24,
                  }}
                  key={index}
                >
                  <A href={`#${heading.id}`}>{heading.text}</A>
                </Item>
              ))}
            </ul>
          </Div>
        </Div>
      )}
      <Article
        center={props.center}
        css={
          hasHeadings
            ? {
                '@lg': {
                  width: '75%',
                },
              }
            : undefined
        }
      >
        <Component components={mdxComponents} />
      </Article>
    </Div>
  );
};

const Item = styled('li');

const A = styled('a', {
  display: 'inline-block',
  px: '$2',
  py: '$2',
  fontSize: '$sm',
});
