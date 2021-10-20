Following is an example in TSX.

```tsx frame
import { TextInput } from 'components';

const Example = () => {
  const [value, setValue] = React.useState<string>('');

  return (
    <TextInput
      value={value}
      onValue={setValue}
      placeholder="Type something..."
      className="text-lg sm:text-base"
    />
  );
};

render(
  <div>
    <Example />
    <Example />
    <Example />
    <Example />
    <Example />
    <Example />
  </div>
);
```

Works with third-party library too.

```tsx frame
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
