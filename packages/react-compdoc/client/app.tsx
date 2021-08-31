import type Data from 'react-compdoc-components';
import { ComponentMeta } from './components/component-meta';

export const App = (props: { data: typeof Data }) => (
  <div>
    {props.data.items.map(({ component, doc: Doc }, i) => (
      <article key={i}>
        <ComponentMeta doc={component} />
        {Doc && <Doc />}
      </article>
    ))}
  </div>
);
