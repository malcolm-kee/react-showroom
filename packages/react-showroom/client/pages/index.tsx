import sections from 'react-showroom-sections';
import { Div } from '../components/base';
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
          <a id="__react-showroom-main__" tabIndex={-1} aria-hidden>
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
          <h1>React Showroom Site</h1>
        </Div>
      </Div>
    </Div>
  </Div>
);
