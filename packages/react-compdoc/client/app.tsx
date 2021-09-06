import { IdProvider } from '@radix-ui/react-id';
import React from 'react';
import sections from 'react-compdoc-sections';
import { Div } from './components/base';
import { ComponentDocArticle } from './components/component-doc-article';
import { mdxComponents } from './components/mdx-components';
import { Sidebar } from './components/sidebar';

export const App = () => (
  <IdProvider>
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
                return <ComponentDocArticle doc={section} key={i} />;

              case 'markdown': {
                const { Component } = section;

                return <Component components={mdxComponents} key={i} />;
              }

              default:
                return null;
            }
          })}
        </Div>
      </Div>
    </Div>
  </IdProvider>
);
