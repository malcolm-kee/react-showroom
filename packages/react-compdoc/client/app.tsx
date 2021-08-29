import type Data from 'react-compdoc-components';

export const App = (props: { data: typeof Data }) => (
  <div>
    {props.data.items.map(({ component, doc: Doc }, i) => (
      <section key={i}>
        <h2>{component.displayName}</h2>
        {component.description && <p>{component.description}</p>}
        {Doc && <Doc />}
      </section>
    ))}
  </div>
);
