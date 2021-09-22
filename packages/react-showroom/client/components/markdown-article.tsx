import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import { Collapsible, styled } from '@showroomjs/ui';
import * as React from 'react';
import { Article } from './article';
import { Div } from './base';
import { mdxComponents } from './mdx-components';
import { isSpa } from '../lib/config';

export const MarkdownArticle = (props: {
  section: ReactShowroomMarkdownSection;
  showLinkToDetails?: boolean;
  center?: boolean;
}) => {
  const {
    section: { Component, headings, slug },
  } = props;

  const hasHeadings = headings && headings.length > 0 && slug !== '';

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
              paddingLeft: '$6',
              width: '25%',
              position: 'sticky',
              top: 58,
              bottom: 0,
              maxHeight: 'calc(100vh - 58px - 2rem)',
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
                    {heading.id ? (
                      <A
                        href={`#${heading.id}`}
                        onClick={
                          isSpa
                            ? (ev) => {
                                ev.preventDefault();
                                scrollToAnchor(heading.id!);
                              }
                            : undefined
                        }
                      >
                        {heading.text}
                      </A>
                    ) : (
                      heading.text
                    )}
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
              top: 0,
              py: '$4',
            }}
          >
            <Div
              css={{
                pointerEvents: 'none',
                height: '3rem',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                backgroundImage:
                  'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              }}
            />
            <Div
              css={{
                maxHeight: '80vh',
                overflow: 'auto',
                py: '$6',
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
                    {heading.id ? (
                      <A
                        href={`#${heading.id}`}
                        onClick={
                          isSpa
                            ? (ev) => {
                                ev.preventDefault();
                                scrollToAnchor(heading.id!);
                              }
                            : undefined
                        }
                      >
                        {heading.text}
                      </A>
                    ) : (
                      heading.text
                    )}
                  </Item>
                ))}
              </ul>
            </Div>
            <Div
              css={{
                pointerEvents: 'none',
                height: '3rem',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                backgroundImage:
                  'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              }}
            />
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
        <Component components={components} />
      </Article>
    </Div>
  );
};

const { code: Code } = mdxComponents;

const components = {
  ...mdxComponents,
  code: function CustomCode({
    live,
    static: staticValue = !live,
    ...props
  }: React.ComponentPropsWithoutRef<typeof Code> & {
    live?: boolean;
  }) {
    return <Code static={staticValue} {...props} />;
  },
};

const Item = styled('li');

const A = styled('a', {
  display: 'inline-block',
  px: '$2',
  py: '$2',
  fontSize: '$sm',
});

const scrollToAnchor = (id: string) => {
  const target = document.getElementById(id);

  if (target) {
    import('scroll-into-view-if-needed').then((scroll) =>
      scroll.default(target, {
        scrollMode: 'if-needed',
      })
    );
  }
};
