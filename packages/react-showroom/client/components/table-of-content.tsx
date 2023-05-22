import { ReactShowroomMarkdownHeading } from '@showroomjs/core/react';
import { Collapsible, styled, EditIcon } from '@showroomjs/ui';
import * as React from 'react';
import { Div, A as Link, Span } from './base';

export const TableOfContent = ({
  headings,
  editUrl,
}: {
  headings: Array<ReactShowroomMarkdownHeading>;
  editUrl: string | null;
}) => {
  const [submenuIsOpen, setSubmenuIsOpen] = React.useState<boolean | undefined>(
    false
  );

  const hasHeadings = headings && headings.length > 0;

  return (
    <Div
      css={{
        '@xl': {
          paddingLeft: '$6',
          width: '25%',
          position: 'sticky',
          top: 64,
          bottom: 0,
          maxHeight: 'calc(100vh - 58px - 2rem)',
        },
      }}
    >
      {hasHeadings && (
        <Collapsible.Root
          open={submenuIsOpen}
          onOpenChange={setSubmenuIsOpen}
          css={{
            py: '$3',
            borderRadius: '$md',
            overflow: 'hidden',
            marginX: '-8px',
            '@sm': {
              marginX: 0,
            },
            '@xl': {
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
              paddingBottom: '$1',
            }}
          >
            <List
              css={{
                maxHeight: 300,
                '@md': {
                  maxHeight: 500,
                },
                px: '$2',
                overflowY: 'auto',
              }}
            >
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
                      dangerouslySetInnerHTML={{ __html: heading.text }}
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: heading.text }} />
                  )}
                </Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
      {editUrl ? (
        <Div
          css={{
            '@xl': {
              display: 'none',
            },
          }}
        >
          <EditLink floatRight url={editUrl} />
        </Div>
      ) : null}
      <Div
        css={{
          display: 'none',
          '@xl': {
            display: 'block',
          },
          position: 'sticky',
          top: 0,
          py: '$4',
        }}
      >
        <Div css={{ position: 'relative' }}>
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
                'linear-gradient(to bottom, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)',
            }}
          />
          <Div
            css={{
              maxHeight: '80vh',
              overflow: 'auto',
              py: '$6',
              borderLeft: '1px solid $gray-300',
              overscrollBehavior: 'contain',
            }}
          >
            {hasHeadings && (
              <>
                <Div
                  css={{
                    color: '$gray-400',
                    paddingLeft: 24,
                    marginBottom: '$2',
                    textTransform: 'uppercase',
                    fontSize: '$sm',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                  }}
                >
                  In this page
                </Div>
                <List>
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
                          dangerouslySetInnerHTML={{ __html: heading.text }}
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: heading.text }}
                        />
                      )}
                    </Item>
                  ))}
                </List>
              </>
            )}
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
                'linear-gradient(to top, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)',
            }}
          />
        </Div>
        {editUrl ? (
          <Div
            css={{
              position: 'fixed',
              bottom: '$6',
              paddingLeft: '$3',
            }}
          >
            <EditLink url={editUrl} />
          </Div>
        ) : null}
      </Div>
    </Div>
  );
};

const List = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const Item = styled('li');

const A = styled('a', {
  display: 'inline-block',
  px: '$2',
  py: '$2',
  fontSize: '$sm',
  textDecoration: 'none',
  color: 'inherit',
});

const EditLink = (props: {
  url: string;
  floatRight?: boolean;
  fullWidth?: boolean;
}) => (
  <Link
    css={{
      float: props.floatRight ? 'right' : undefined,
      display: props.fullWidth ? 'flex' : 'inline-flex',
      alignItems: 'center',
      gap: '$2',
      fontSize: '$xs',
      paddingInline: '$3',
      paddingBlock: '$1',
      color: '$gray-400',
      '&:hover': {
        backgroundColor: '$gray-100',
      },
    }}
    href={props.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Span
      css={{
        color: '$gray-500',
        fontWeight: 500,
        letterSpacing: '0.05em',
      }}
    >
      EDIT THIS PAGE
    </Span>
    <EditIcon width={16} height={16} />
  </Link>
);
