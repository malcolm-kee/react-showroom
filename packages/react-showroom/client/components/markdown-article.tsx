import { ReactShowroomMarkdownSection } from '@showroomjs/core/react';
import { styled } from '@showroomjs/ui';
import { Article } from './article';
import { Div } from './base';
import { mdxComponents } from './mdx-components';

export const MarkdownArticle = (props: {
  section: ReactShowroomMarkdownSection;
  showLinkToDetails?: boolean;
  center?: boolean;
}) => {
  const {
    section: { Component, headings },
  } = props;

  const hasHeadings = headings && headings.length > 0;

  return (
    <Div
      css={
        hasHeadings
          ? {
              display: 'flex',
            }
          : undefined
      }
    >
      <Article
        center={props.center}
        css={
          hasHeadings
            ? {
                width: '75%',
              }
            : undefined
        }
      >
        <Component components={mdxComponents} />
      </Article>
      {hasHeadings && (
        <Div css={{ width: '25%', px: '$6' }}>
          <Div
            css={{
              position: 'sticky',
              top: '$6',
              borderLeft: '1px solid $gray-300',
              py: '$3',
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
