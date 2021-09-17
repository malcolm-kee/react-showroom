# CHANGELOG

## 0.4.1

### Bug Fixes

- Default code blocks to be static for docs.

### Documentations

- Add docs on adding non-component documentations.

## 0.4.0

### New Features

- `import` statements in examples will be automatically parsed and the package will be injected if the package is available in the project instead of requires manual addition to the `imports` in the configuration.
- If user add additional import statements in the live editor, the package will be downloaded from [Skypack](https://www.skypack.dev/) on the fly.
- The code will be encoded in the URL if the example is viewed in Dialog. This would make it easier for developers to share updated examples.

## 0.3.0

### New Features

- Auto insert `render` is last expression of code example is a JSX.
- New config option: `require` to include third-party libraries or polyfills.

## 0.2.2

### Bug Fixes

- Ignore certain patterns for components, with `ignores` config option.
- Handle fails to parse component data gracefully.

## 0.2.1

### Bug Fixes

- Support React Fast Refresh for better documentation experience.

## 0.2.0

### New Features

- Include basic SEO meta tags
