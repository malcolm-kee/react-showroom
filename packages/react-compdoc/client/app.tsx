import type Data from 'react-compdoc-components';
import { Div } from './components/base';
import { Code, Pre } from './components/code-block';
import { ComponentMeta } from './components/component-meta';

const components = {
  pre: Pre,
  code: Code,
};

export const App = (props: { data: typeof Data }) => (
  <main>
    <Div
      css={{
        maxWidth: '$screenXl',
        marginX: 'auto',
        padding: '$6',
      }}
    >
      {props.data.items.map(({ component, doc: Doc }, i) => (
        <article key={i}>
          <ComponentMeta doc={component} />
          {Doc && <Doc components={components} />}
        </article>
      ))}
    </Div>
  </main>
);
