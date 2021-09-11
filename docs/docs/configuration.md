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

## Config Options

### `imports`

- Type: `Array<{ name: string; path: string; } | string>`
