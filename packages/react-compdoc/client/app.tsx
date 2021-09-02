import type Data from 'react-compdoc-components';
import { Div } from './components/base';
import { ComponentDocArticle } from './components/component-doc-article';
import { Sidebar } from './components/sidebar';

export const App = (props: { data: typeof Data }) => (
  <Div
    css={{
      display: 'flex',
      minHeight: '100%',
    }}
  >
    <Sidebar items={props.data.items} />
    <Div
      as="main"
      css={{
        flex: '1',
      }}
    >
      <Div
        css={{
          maxWidth: '$screenXl',
          marginX: 'auto',
          padding: '$6',
        }}
      >
        {props.data.items.map((item, i) => (
          <ComponentDocArticle doc={item} key={i} />
        ))}
      </Div>
    </Div>
  </Div>
);
