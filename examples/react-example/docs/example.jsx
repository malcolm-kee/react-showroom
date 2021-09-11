import * as React from 'react';

export const Example = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="inline-flex gap-3 p-3 my-2 shadow">
      <button onClick={() => setCount(count - 1)}>minus</button>
      <div className="w-10 text-center">{count}</div>
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  );
};
