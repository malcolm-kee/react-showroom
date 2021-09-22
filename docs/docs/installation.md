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

## 2. Start Showroom for Development

```bash
npx react-showroom dev
```

All components in `src/components` folders will be automatically parsed and listed. You can customize what components are loaded via [configuration](/api/configuration#components).

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

## 3. Build Showroom for Deployment

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
