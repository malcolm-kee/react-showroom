import type Data from 'react-compdoc-components';
import { Code, Pre } from './components/code-block';
import { ComponentMeta } from './components/component-meta';

const components = {
  pre: Pre,
  code: Code,
};

export const App = (props: { data: typeof Data }) => (
  <div>
    <main className="max-w-screen-2xl mx-auto p-6">
      {props.data.items.map(({ component, doc: Doc }, i) => (
        <article key={i}>
          <ComponentMeta doc={component} />
          {Doc && <Doc components={components} />}
        </article>
      ))}
    </main>
  </div>
);
