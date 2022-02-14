---
hideSidebar: true
---

# About

This example is created as a playground and showcase of `react-showroom`.

## Example in doc

```tsx live frame
import { Button } from 'components';

const Demo = () => {
  const [file, setFile] = React.useState<File | undefined>(undefined);

  return (
    <div className="flex items-center gap-3">
      <Button>Hello</Button>
      <div>
        <input
          type="file"
          onChange={(ev) => {
            if (ev.target.files) {
              setFile(ev.target.files[0]);
            }
          }}
        />
        {file && <p>Selected file: {file.name}</p>}
      </div>
    </div>
  );
};

<Demo />;
```

Pure TS example:

```ts live frame
import cx from 'classnames';

console.log(cx('hahaha', true && 'lol'));
```

[Component playground](https://react-showroom.js.org/getting-started/component-playground) example:

```tsx live frame
import { usePropsEditor } from 'react-showroom/client';
import { Button } from 'components';

const Demo = () => {
  const editor = usePropsEditor({
    initialProps: {
      children: 'Bye',
      variant: 'outline',
    },
    controls: {
      children: 'text',
      variant: {
        type: 'select',
        options: [
          {
            label: 'primary',
            value: 'primary',
          },
          {
            label: 'outline',
            value: 'outline',
          },
        ],
      },
    },
  });

  return <Button {...editor.props} />;
};

<Demo />;
```

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| Name    | Type           |
| :------ | :------------- |
| `array` | readonly `T`[] |
| `from`  | `number`       |
| `to`    | `number`       |

## Tasklist

- [ ] to do
- [x] done
