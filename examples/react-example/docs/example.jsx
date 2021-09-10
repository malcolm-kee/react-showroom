import * as React from 'react';

export const Example = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>minus</button>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  );
};
