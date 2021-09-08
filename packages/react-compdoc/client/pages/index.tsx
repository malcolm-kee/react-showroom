import sections from 'react-compdoc-sections';
import { Div } from '../components/base';
import { Header } from '../components/header';
import { Seo } from '../components/seo';
import { Sidebar } from '../components/sidebar';

export const DefaultHomePage = () => (
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
          <h1>React Compdoc Site</h1>
        </Div>
      </Div>
    </Div>
  </Div>
);
