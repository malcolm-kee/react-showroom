```tsx
const Demo = () => {
  const [value, setValue] = React.useState('textarea');

  return <Textarea value={value} onValue={setValue} />;
};

<Demo />;
```
