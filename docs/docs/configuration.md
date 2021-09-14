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
- Default: Load from `webpack.config.js` from project root if the file is available.

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

### `build.outDir`

- Type: `string`
- Default: `'showroom'`

Output folder for the generated site.

### `build.prerender`

- Type: `boolean`

Enable pre-rendering when generating site.

This is useful to ensure your components are SSR-friendly.

Note that this would increase time to generate the static site because we will need to generate separate bundle for pre-rendering.

### `build.basePath`

- Type: `string`
- Default: `'/'`
- Example: `'/docs'`

Set a prefix for the static site if your site is hosted at a site path.

Note that this only matters if `prerender` is set to `true`.

### `theme.title`

- Type: `string`
- Default: `'React Showroom'`

Title to be displayed for the site.

### `devServer.port`

- Type: `number`

Port for the React Showroom Dev Server.

## Advanced Config Options

### `items`

- Type: `Array<ItemConfiguration>`

An array of items to be shown on the sidebar, which can be one of the following 5 types.

#### Component Item

A group of components.

Example:

```js static
{
  type: 'components',
  title: 'Optional title',
  path: 'Optional prefix for all the components paths',
  components: 'src/folderName/**/*.tsx'
}
```

#### Content Item

A markdown file.

Example:

```js static
{
  type: 'content',
  title: 'Optional title, if not provided by will be inferred from first h1 of the markdown file',
  type: 'content',
  content: 'docs/about.md'
}
```

#### Link Item

A link (internal or external).

Example:

```js static
{
  type: 'link',
  title: 'GitHub',
  href: 'https://github.com/malcolm-kee/react-showroom'
}
```

#### Doc Item

A group of markdown files.

Example:

```js static
{
  type: 'docs',
  folder: 'docs-folder'
}
```

#### Group Item

A grouping of items, which can contain more `items`.

Example:

```js static
{
  type: 'group',
  title: 'Core',
  items: [
    {
      type: 'components',
       components: 'src/button/**/*.tsx'
    },
    {
      type: 'content',
      content: 'src/core/about-core.md'
    }
  ]
}
```

### `assetDirs`

- Type: `Array<string>`

Your application static assets folder to be accessible as / in the style guide server.

When generate the static site, those files will be copied into the output folder.

### `wrapper`

- Type: `string`

Path to a module/file that export default a React component that should wrap the entire showroom.

Use this to render context providers that your application need, e.g. Redux Provider.

### `theme.codeTheme`

- Default: `require('prism-react-renderer/themes/nightOwl')`

One of the themes provided by `'prism-react-renderer'`.

### `theme.resetCss`

- Type: `boolean`
- Default: `true`

By default we include [`modern-normalize`](https://github.com/sindresorhus/modern-normalize). You can disable it if you already using your own CSS reset.

### `theme.colors`

Customize the primary color.

Should be an object with the following shape:

```js static
{
  'primary-50': string;
  'primary-100': string;
  'primary-200': string;
  'primary-300': string;
  'primary-400': string;
  'primary-500': string;
  'primary-600': string;
  'primary-700': string;
  'primary-800': string;
  'primary-900': string;
}
```

### `theme.navbar`

An object to customize your navigation bar.

Example:

```js static
{
    version: '1.2.2',
    logo: {
      alt: 'My Library',
      src: 'https://my-domain/logo.png'
      width: '34px',
      height: '34px',
    };
    items: [
      {
        to: 'https://github.com/my-name/repo.git',
        label: 'GitHub'
      }
    ]
  }
```
