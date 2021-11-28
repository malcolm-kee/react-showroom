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
      className="text-lg sm:text-base"
    />
  );
};

render(<Example />);
```

Works with third-party library too.

```tsx frame
import { useForm } from 'react-hook-form';

const Example = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: 'react-hook-form',
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => console.log(data))}
      className="space-y-2"
    >
      <TextInput {...register('name')} />
      <div>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

render(<Example />);
```
