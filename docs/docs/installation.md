---
description: Learn how to get React Showroom up and running in your project.
---

# Installation

Learn how to get React Showroom up and running in your project.

---

## 1. Install React Showroom

```bash
npm i -D react-showroom
```

Install webpack if you don't have it already.

```bash
npm i -D webpack
```

## 2. Configure Showroom

Add a `react-showroom.js` file at the root of your project.

A minimal config file would look like below.

```js fileName="react-showroom.js" static
// @ts-check
const { defineConfig } = require('react-showroom');
const webpackConfig = require('./webpack.config');

module.exports = defineConfig({
  webpackConfig,
});
```

All the available configuration options are specified [here](/api/configuration).

## 3. Start Showroom for Development

```bash
npx react-showroom dev
```

You probably want to add a npm script in your `package.json`:

```json fileName="package.json"
{
  ...
  "scripts": {
    ...
    "start": "react-showroom dev"
  }
}
```

## 4. Build Showroom for Deployment

```bash
npx react-showroom build
```

You probably want to add a npm script in your `package.json`:

```json fileName="package.json"
{
  ...
  "scripts": {
    ...
    "start": "react-showroom build"
  }
}
```
