Following is an example in TSX.

```tsx
import { TextInput } from 'components';

const Example = () => {
  const [value, setValue] = React.useState<string>('');

  return (
    <TextInput
      value={value}
      onValue={setValue}
      placeholder="Type something..."
    />
  );
};

render(<Example />);
```

Works with third-party library too.

```tsx
import { TextInput } from 'components';
import { useForm } from 'react-hook-form';

const Example = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: 'react-hook-form',
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <TextInput {...register('name')} />
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

render(<Example />);
```
