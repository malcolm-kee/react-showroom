# CHANGELOG

## 0.7.2

### Bug Fixes

- Fix SEO for real.

## 0.7.1

### Bug Fixes

- Canonical URL bug.

## 0.7.0

### New Features

- Add canonical URL in header if `url` is set.

### Bug Fixes

- Fix UI not mobile friendly

## 0.6.0

### New Features

- Added `@showroomjs/bundles` to prebundle some third-party libraries to fix compatibility issue.

### Bug Fixes

- Fix dom structure so scroll position is maintained when page refresh.
- Change hash focus logic from `document.querySelector` to `document.getElementById` to handle the edge case of id starting with number.
- Fix prerender logic for code example in markdown are pre-rendered as well.

## 0.5.0

### New Features

- Standalone view now is a separate page for better compatibility.
- Improve docs to demo standalone view behavior.

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
