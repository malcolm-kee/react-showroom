```tsx frame
const Demo = () => {
  const [value, setValue] = React.useState('textarea');

  return <Textarea value={value} onValue={setValue} />;
};

<Demo />;
```

## Another Long Example

```tsx
import { Button, Select, TextInput, Textarea } from 'components';

const Demo = () => {
  const [name, setName] = React.useState('');

  return (
    <div className="p-6 grid sm:grid-cols-2 gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <TextInput id="name" value={name} onValue={setName} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="desc">Description</label>
        <Textarea id="desc" minRows={5} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="framework">Framework</label>
        <Select id="framework">
          <option value="react">React</option>
          <option value="ng">Angular</option>
          <option value="vue">Vue</option>
        </Select>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <span>Special treatment</span>
          <input type="checkbox" />
        </label>
      </div>
      <div>
        <Button
          onClick={() => console.log('Submit is clicked!')}
          variant="primary"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

<Demo />;
```
