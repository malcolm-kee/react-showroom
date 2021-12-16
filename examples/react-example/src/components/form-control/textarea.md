```tsx frame
const Demo = () => {
  const [value, setValue] = React.useState('textarea');

  return <Textarea value={value} onValue={setValue} />;
};

<Demo />;
```

## Another Long Example

```tsx
import { Button, TextInput, Textarea } from 'components';

<div className="p-6 grid gap-5">
  <div className="flex flex-col gap-2">
    <label htmlFor="name">Name</label>
    <TextInput id="name" />
  </div>
  <div className="flex flex-col gap-2">
    <label htmlFor="age">Age</label>
    <TextInput id="age" />
  </div>
  <div className="flex flex-col gap-2">
    <label htmlFor="desc">Description</label>
    <Textarea id="desc" minRows={5} />
  </div>
  <div>
    <Button variant="primary">Submit</Button>
  </div>
</div>;
```
