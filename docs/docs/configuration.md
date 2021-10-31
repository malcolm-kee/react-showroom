---
description: Learn how to configure React Showroom to fit your use case.
---

# Configuration

Learn how to configure React Showroom to fit your use case.

---

## Config Format

You can declare a static object or a function call that return the object.

```js fileName="react-showroom.config.js"
// @ts-check
const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  imports: [
    {
      name: 'components',
      path: './src/components',
    },
  ],
});
```

```js fileName="react-showroom.config.js"
// @ts-check
const { defineConfig } = require('react-showroom');

module.exports = defineConfig((command) => {
  // command will be either 'dev' or 'build', depending
  // if you are running react-showroom dev or react-showroom build

  return {
    imports: [
      {
        name: 'components',
        path: './src/components',
      },
    ],
  };
});
```

## Config Intellisense

Use `defineConfig` [identity function](https://en.wikipedia.org/wiki/Identity_function) which should provide intellisense automatically.

It is also recommended (but not required) to add `// @ts-check` comment at the top of the file so any misconfiguration will be reported by your editor.

## Config Options

### `components`

- Type: `string`
- Default: `'src/components/**/*.{ts,tsx}'` if `items` is not provided.

A glob pattern string to search for all your components.

If you want to organize your components in a nested structure, use `items`.

### `imports`

- Type: `Array<{ name: string; path: string; } | string>`

Modules to be available in examples via `import`.

Pass `name` (how it is imported) and `path` (relative path from project root).

For example, if all your components should be imported with `'@/components'`, which is a file at `src/components/index.ts` in your project, then add the following configuration:

```js fileName="react-showroom.config.js"
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

### `example.widths`

- Type: `Array<number>`
- Default: `[320, 768, 1024]`

Widths for the preview in example standalone view.

### `build.outDir`

- Type: `string`
- Default: `'showroom'`

Output folder for the generated site.

### `build.prerender`

- Type: `boolean`
- Default: `true`

Enable pre-rendering for example.

This is useful to ensure your components are SSR-friendly.

### `build.basePath`

- Type: `string`
- Default: `'/'`
- Example: `'/docs'`

Set a prefix for the static site if your site is hosted at a subpath.

### `theme.title`

- Type: `string`
- Default: `'React Showroom'`

Title to be displayed for the site.

### `devServer.port`

- Type: `number`
- Default: `6969`

Port for the React Showroom Dev Server.

## Advanced Config Options

### `items`

- Type: `Array<ItemConfiguration>`

An array of items to be shown on the sidebar, which can be one of the following 5 types.

#### Component Item

A group of components.

Example:

```js
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

```js
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

```js
{
  type: 'link',
  title: 'GitHub',
  href: 'https://github.com/malcolm-kee/react-showroom'
}
```

#### Doc Item

A group of markdown files.

Example:

```js
{
  type: 'docs',
  folder: 'docs-folder'
}
```

#### Group Item

A grouping of items, which can contain more `items`.

Example:

```js
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

### `assetDir`

- Type: `string`

Your application static assets folder to be accessible at "/" in the style guide server.

When generate the static site, those files will be copied into the output folder.

### `require`

- Type: `Array<string>`

Modules that are required for your style guide. Useful for third-party styles or polyfills.

This is the preferred way to load global CSS, such as TailwindCSS.

### `wrapper`

- Type: `string | undefined`

Path to a module/file that export default a React component to wrap the entire showroom.

Use this to render context providers that your application need, e.g. Redux Provider.

### `cacheDir`

- Type: `string | false`
- Default: `'.showroom_cache'`

Cache directory for the build.

Pass `false` to disable caching.

### `ignores`

- Type: `Array<string>`
- Default: `['**/__tests__/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}','**/*.d.ts']`

Patterns to ignore for components.

### `skipEmptyComponent`

- Type: `boolean | undefined`

Ignore components that don’t have an example file nor props definition other than defined in `'@types/react'`.

### `example.placeholder`

- Type: `string | undefined`

Path to a module/file that export default a React component as placeholder when there is no example file for the component.

The component will receives `componentFilePath` prop (`string`).

### `theme.audienceToggle`

- Type: `'design' | 'code' | false`
- Default: `'design'`

Default value for the audience toggle.

Set to `false` if you do not want to show the toggle, which means it will always be 'code'.

### `theme.favicon`

- Type: `string | undefined`

Path to your site favicon.

Example, if your favicon is in `asset/img/favicon.ico`:

```js fileName="react-showroom.config.js"
module.exports = {
  assetDir: 'asset',
  theme: {
    favicon: '/img/favicon.ico',
  },
};
```

### `theme.codeTheme`

- Default: `require('prism-react-renderer/themes/nightOwl')`

One of the themes provided by `'prism-react-renderer'`.

### `theme.resetCss`

- Type: `boolean`
- Default: `true`

By default we include [`modern-normalize`](https://github.com/sindresorhus/modern-normalize). You can disable it if you already include your own CSS reset.

### `theme.colors`

Customize the primary color.

Should be an object with the following shape:

```js
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

```js
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
