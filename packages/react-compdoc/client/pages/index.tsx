import * as React from 'react';
import sections from 'react-compdoc-sections';
import { Div } from '../components/base';
import { ComponentDocArticle } from '../components/component-doc-article';
import { MarkdownArticle } from '../components/markdown-article';
import { Sidebar } from '../components/sidebar';

export const HomePage = () => (
  <Div
    css={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    }}
  >
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
        {sections.map(function mapSection(
          section,
          i
        ): React.ReactElement<any> | null {
          switch (section.type) {
            case 'group':
              return (
                <React.Fragment key={i}>
                  {section.items.map(mapSection)}
                </React.Fragment>
              );

            case 'component':
              return (
                <ComponentDocArticle
                  doc={section}
                  key={i}
                  showLinkToDetailsPage
                />
              );

            case 'markdown':
              return (
                <MarkdownArticle section={section} key={i} showLinkToDetails />
              );

            default:
              return null;
          }
        })}
      </Div>
    </Div>
  </Div>
);
