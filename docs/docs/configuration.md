---
description: Learn how to configure React Showroom to fit your use case.
---

# Configuration

Learn how to configure React Showroom to fit your use case.

---

## Config Format

You can declare a static object or a function call that return the object.

```js fileName="react-showroom.js" static
// @ts-check
const { defineConfig } = require('react-showroom');
const webpackConfig = require('./webpack.config');

module.exports = defineConfig({
  webpackConfig,
});
```

```js fileName="react-showroom.js" static
// @ts-check
const { defineConfig } = require('react-showroom');
const webpackConfig = require('./webpack.config');

module.exports = defineConfig(() => {
  return {
    webpackConfig,
  };
});
```

## Config Intellisense

Use `defineConfig` [identity function](https://en.wikipedia.org/wiki/Identity_function) which should provide intellisense automatically.

It is also recommended (but not required) to add `// @ts-check` comment at the top of the file so any misconfiguration will be reported by your editor.

## Config Options

### `webpackConfig`

- Type: `webpack.Configuration | ((env: 'development' | 'production') => webpack.Configuration)`

Webpack configuration to load your components (or any other resources that are needed by the components, e.g. CSS)

### `components`

- Type: `string`
- Default: `'src/components/**/*.{ts,tsx}'` if `items` is not provided.

A glob pattern string to search for all your components.

If you want to organize your components in a nested structure, use `items`.

### `imports`

- Type: `Array<{ name: string; path: string; } | string>`

Modules to be available in examples via `import`.

- If it's a local module in the project, pass 'name' (how it is imported) and 'path' (relative path from project root).

  For example, if all your components should be imported with `'@/components'`, which is a file at `src/components/index.ts` in your project, then add the following configuration:

  ```js fileName="react-showroom.js" static
  const { defineConfig } = require('react-showroom');

  module.exports = defineConfig({
    imports: [
      {
        name: '@/components',
        path: './src/components',
      },
    ],
  });
  ```

- If it's a third-party library, pass the package name.

  For example, if you want to allow your examples to import `react-hook-form`, add the following configuration:

  ```js fileName="react-showroom.js" static
  const { defineConfig } = require('react-showroom');

  module.exports = defineConfig({
    imports: ['react-hook-form'],
  });
  ```
