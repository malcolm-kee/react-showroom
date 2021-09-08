import * as React from 'react';
import sections from 'react-compdoc-sections';
import { Div } from '../components/base';
import { ComponentDocArticle } from '../components/component-doc-article';
import { Header } from '../components/header';
import { MarkdownArticle } from '../components/markdown-article';
import { Seo } from '../components/seo';
import { Sidebar } from '../components/sidebar';

export const HomePage = () => (
  <Div
    css={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}
  >
    <Seo />
    <Header />
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
            opacity: 0,
          }}
        >
          <a id="__react-compdoc-main__" tabIndex={-1} aria-hidden>
            Main Content
          </a>
        </Div>
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
                  <ComponentDocArticle doc={section} mode="embedded" key={i} />
                );

              case 'markdown':
                return (
                  <MarkdownArticle
                    section={section}
                    key={i}
                    showLinkToDetails
                  />
                );

              default:
                return null;
            }
          })}
        </Div>
      </Div>
    </Div>
  </Div>
);
