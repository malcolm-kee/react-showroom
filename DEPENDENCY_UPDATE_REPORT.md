# react-showroom: Dependency & Config Update Report

> Generated: 2026-02-17

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Unmaintained Dependencies](#unmaintained-dependencies)
3. [Significantly Outdated Dependencies](#significantly-outdated-dependencies)
4. [Moderately Outdated Dependencies](#moderately-outdated-dependencies)
5. [Config Improvements](#config-improvements)
6. [Recommended Migration Priority](#recommended-migration-priority)

---

## Executive Summary

The react-showroom monorepo has accumulated significant dependency debt. Key findings:

- **1 unmaintained critical dependency**: `@stitches/react` (CSS-in-JS, deeply embedded in 30+ files)
- **TypeScript 4.6** is 4 major versions behind current stable (5.8.x)
- **Turbo 1.4** is a full major version behind (latest: 2.7.x) with breaking config changes
- **Rollup 2.x** is EOL (latest: 4.x)
- **esbuild 0.14** is far behind (latest: 0.25.x)
- Several deprecated patterns: `react-helmet` (unmaintained), `node-fetch` v2 (Node 18+ has native `fetch`)
- pnpm catalog support could eliminate version duplication across 6+ packages

---

## Unmaintained Dependencies

### `@stitches/react` ^1.2.8 (CRITICAL)

**Status**: Officially unmaintained. GitHub repo marked "[Not Actively Maintained]" since late 2022.

**Impact in this project**: Deeply embedded in `@showroomjs/ui`:
- 30+ files import from `stitches.config.ts`
- 83+ `styled()` calls across 26 component files
- SSR integration via `getCssText()` in server entries and prerender logic
- Full theme token system (colors, spacing, fonts, radii, media queries)
- Custom utility functions (`marginX`, `marginY`, `px`, `py`, `inset`, `outlineRing`, `shadow`, `srOnly`)

**Replacement options** (in order of recommendation):

| Option | Effort | Pros | Cons |
|--------|--------|------|------|
| **Panda CSS** | Medium | Official Stitches migration guide; closest API match; build-time CSS extraction; type-safe tokens; actively maintained by Chakra team | Requires PostCSS/CLI build integration |
| **Tailwind CSS + CVA** | High | Already in project devDeps; dominant ecosystem; shadcn/ui patterns | Paradigm shift from styled-component approach; 83+ components to rewrite |
| **Vanilla Extract** | Medium-High | Zero runtime; TypeScript-first; stable | More verbose; smaller community |
| **CSS Modules** | High | Zero runtime; zero dependencies; works with any bundler | No variant system; no theme token system; most manual work |
| **Vanilla CSS** (what Radix did) | High | Zero dependencies; best performance; future-proof | No type safety; no built-in variant patterns |

**Recommendation**: **Panda CSS** — It has an [official Stitches migration guide](https://panda-css.com/docs/migration/stitches), the closest API mapping, and eliminates the SSR `getCssText()` complexity since styles are extracted at build time.

Key API mappings:
- `styled('div', { ... })` → `styled('div', { base: { ... } })`
- `css({ variants: { ... } })` → `cva({ variants: { ... } })`
- `createStitches({ theme })` → `panda.config.ts` with `defineConfig({ theme })`
- `getCssText()` (SSR) → Not needed (build-time extraction)
- Custom utils (`marginX`, etc.) → `utilities` in panda config

### `react-helmet` ^6.1.0

**Status**: Unmaintained. No updates since 2020.

**Used in**: `packages/react-showroom`

**Replacements**:
- `react-helmet-async` — Drop-in replacement with async SSR support
- React 19 built-in `<title>`, `<meta>`, `<link>` support in component render

### `react-query` ^3.39.1

**Status**: v3 is legacy. Rebranded to `@tanstack/react-query`.

**Used in**: `packages/bundles`

**Replacement**: `@tanstack/react-query` v5.x — The v3→v5 migration is well-documented. v3 is no longer maintained.

### `react-simple-code-editor` ^0.11.2

**Status**: Very low maintenance. Last meaningful update was years ago.

**Used in**: `packages/bundles`

**Alternatives**: Consider CodeMirror 6 or the existing Monaco editor integration.

---

## Significantly Outdated Dependencies

### TypeScript ~4.6.4 → 5.8.x (4 major versions behind)

**Used in**: Every package (6 packages duplicate `~4.6.4`)

**What you gain by upgrading**:
- `satisfies` operator (4.9)
- `const` type parameters (5.0)
- Decorator metadata (5.2)
- `using` declarations / Explicit Resource Management (5.2)
- Bundler module resolution (5.0) — better for library authoring
- `moduleResolution: "bundler"` — matches how modern bundlers resolve modules
- Performance improvements throughout

**Breaking risks**: Stricter type checking in newer versions may surface existing type errors. The `~4.6.4` pin across all packages suggests this was intentional to avoid churn.

**Note**: TypeScript 6.0 is in beta (Feb 2026), and TypeScript 7.0 (Go-based "Corsa" rewrite with 10x faster compilation) is targeting mid-2026.

### Turbo 1.4.2 → 2.7.x (breaking config changes)

**Current config** (`turbo.json`):
```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": { ... }
}
```

**Required migration**:
- `pipeline` → `tasks`
- `$schema` URL changed to `https://turbo.build/schema.json`
- `packageManager` field now required in root `package.json`
- Cache location moved from `node_modules/.cache` to `.turbo/cache`

**New features gained**:
- Terminal UI (TUI) with interactive task filtering
- `turbo watch` for development with caching
- `turbo devtools` — visual Package/Task Graph explorer
- Composable configuration across packages
- Boundaries — enforce dependency rules between packages
- JSONC support (`turbo.jsonc`)

**Migration**: Run `npx @turbo/codemod migrate` for automated migration.

### Rollup ^2.77.2 → 4.x (EOL)

**Used in**: `packages/bundles`

**Breaking changes in v3→v4**: Plugin API changes, configuration changes. The project's rollup config uses `@rollup/plugin-node-resolve`, `@rollup/plugin-commonjs`, `@rollup/plugin-typescript`, and `@rollup/plugin-replace` — all of which have v4-compatible versions.

### esbuild 0.14.53 → 0.25.x

**Used in**: `packages/core`, `packages/react-showroom`

**Notable**: esbuild still hasn't reached 1.0 but is actively maintained. Upgrading is generally safe — breaking changes are documented per release.

### ESLint ^8.43.0 → 9.x

**Changes**: ESLint 9 uses "flat config" as default (eslint.config.js instead of .eslintrc.js). ESLint 8 is in maintenance mode.

**Current config**: `.eslintrc.js` with `extends`, `parser`, `plugins` — would need to be migrated to flat config format.

### Jest ^28.1.3 → 30.x (or migrate to Vitest)

**Options**:
- Upgrade to Jest 30.x
- Migrate to Vitest — better ESM support, faster, uses Vite's transform pipeline, compatible test API

### Prettier ^2.7.1 → 3.x

**Breaking changes**: Trailing commas default changed to `all`, some formatting changes. Generally a straightforward upgrade.

### Playwright ^1.24.2 → latest

**Status**: Playwright releases frequently. The current version is far behind. Upgrading brings new browser versions, APIs, and bug fixes.

### `prism-react-renderer` ^1.3.5 → 2.x

**Used in**: `packages/core`, `packages/react-showroom`

**Breaking changes in v2**: API changes, theme import paths changed.

### `@heroicons/react` ^1.0.6 → 2.x

**Used in**: `packages/ui`, `packages/device-frames`, `packages/react-showroom`

**Breaking changes in v2**: Import paths changed from `@heroicons/react/outline` → `@heroicons/react/24/outline`.

### `tsup` 6.2.1 → 8.x

**Used in**: `packages/measure`, `packages/device-frames`

**Changes**: Updated esbuild, new features, `legacyOutput` option was removed in newer versions.

---

## Moderately Outdated Dependencies

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| `@changesets/cli` | ^2.24.2 | 2.29.x | Security fixes, new config options |
| `webpack` | ^5.74.0 | 5.97.x | Still actively maintained within v5 |
| `@babel/core` + plugins | ^7.18.x | 7.26.x | Still within v7, incremental upgrade |
| `@monaco-editor/react` | ^4.4.5 | 4.7.x | Minor version upgrade |
| `monaco-editor` | ^0.33.0 | 0.52.x | Large version gap, API mostly stable |
| `downshift` | ^6.1.7 | 9.x | Major version gap |
| `react-error-boundary` | ^3.1.4 | 5.x | API changes |
| `node-fetch` | ^2.6.7 | N/A | Replace with native `fetch()` (Node 18+) |
| `rimraf` | ^3.0.2 | 6.x | Or use Node.js built-in `fs.rm` with `recursive: true` |
| `react-router-dom` | 6.3.0 | 7.x | React Router v7 is a Remix merger |
| `tailwindcss` | ^3.1.8 | 4.x | v4 is a major rewrite with new engine |
| `xdm` | ^3.0.0 | N/A | Deprecated in favor of `@mdx-js/mdx` v3 |
| `workbox-*` | ^6.5.4 | 7.x | Service worker tooling major update |

### Deprecated Patterns

- **`node-fetch` v2**: Node.js 18+ (which this project uses — v22.22.0) has built-in global `fetch()`. The `node-fetch` package can be removed entirely.
- **`rimraf`**: Node.js 16.x+ has `fs.rm(path, { recursive: true })`. Consider removing the dependency.
- **`react-scripts` 5.0.1** (in `cra-example`): Create React App is officially deprecated as of Feb 2025. The example should migrate to Vite or be removed.
- **`xdm`**: Deprecated in favor of the official `@mdx-js/mdx` v3.

---

## Config Improvements

### 1. pnpm Catalogs (pnpm 9.5+)

The project has significant version duplication across packages:

| Dependency | Duplicated in # packages |
|------------|------------------------|
| `typescript: ~4.6.4` | 6 |
| `tsup: 6.2.1` | 3 |
| `tslib: ^2.4.0` | 3 |
| `@heroicons/react: ^1.0.6` | 3 |
| `prism-react-renderer: ^1.3.5` | 2 |
| `esbuild: 0.14.53` | 2 |
| `axe-core: ^4.4.3` | 2 |

**Proposed `pnpm-workspace.yaml` with catalogs**:

```yaml
packages:
  - packages/*
  - examples/*
  - docs

catalog:
  # Build tooling
  typescript: ~5.8.0
  tsup: ^8.0.0
  tslib: ^2.4.0
  esbuild: ^0.25.0
  rollup: ^4.0.0

  # React
  react: ^18.2.0
  react-dom: ^18.2.0

  # Shared libraries
  "@heroicons/react": ^2.0.0
  classnames: ^2.3.1
  prism-react-renderer: ^2.0.0
  axe-core: ^4.4.3
  react-docgen-typescript: ^2.2.2
  webpack: ^5.74.0

  # Styling
  postcss: ^8.4.16
  tailwindcss: ^4.0.0

  # Testing
  jest: ^30.0.0
  ts-jest: ^29.0.0
```

Then in each `package.json`, replace version ranges with `"catalog:"`:
```json
{
  "devDependencies": {
    "typescript": "catalog:",
    "esbuild": "catalog:"
  }
}
```

### 2. Add `packageManager` field to root `package.json`

Required by Turbo 2.x and a best practice for reproducible builds:

```json
{
  "packageManager": "pnpm@10.29.3"
}
```

### 3. Turbo 2.x migration

Rename `pipeline` → `tasks` in `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "dist-esm/**", "client-dist/**", "build/**"]
    },
    ...
  }
}
```

### 4. ESLint Flat Config migration

Migrate from `.eslintrc.js` to `eslint.config.js` (flat config) when upgrading to ESLint 9.x. This is the new standard and `.eslintrc.*` files are deprecated.

### 5. pnpm `overrides` in `pnpm-workspace.yaml`

In pnpm v10+, `overrides` (for forcing transitive dependency versions) move from `package.json > pnpm.overrides` to `pnpm-workspace.yaml`:

```yaml
overrides:
  postcss: ^8.4.16
```

### 6. React peer dependency range

Current peer deps across packages: `^17.0.0-0 || ^18.0.0-0`

Should be expanded to include React 19: `^17.0.0-0 || ^18.0.0-0 || ^19.0.0-0`

---

## Recommended Migration Priority

### Phase 1: Low-risk tooling updates (no code changes)

1. **Add `packageManager` field** to root `package.json`
2. **Update `@changesets/cli`** to ^2.29.0
3. **Update Turbo** to 2.7.x (run `npx @turbo/codemod migrate`)
4. **Update Prettier** to 3.x
5. **Introduce pnpm catalogs** for shared dependency versions
6. **Update `.gitignore`** for new Turbo cache location (`.turbo/`)

### Phase 2: Build tooling updates (minor code changes)

1. **Update TypeScript** to ~5.8.0 (fix any new type errors)
2. **Update esbuild** to 0.25.x
3. **Update tsup** to 8.x (remove `legacyOutput` option)
4. **Update Rollup** to 4.x + update `@rollup/*` plugins
5. **Update ESLint** to 9.x + migrate to flat config
6. **Update Jest** to 30.x (or migrate to Vitest)
7. **Update Playwright** to latest

### Phase 3: Library updates (moderate code changes)

1. **Update `@heroicons/react`** to v2 (update import paths)
2. **Update `prism-react-renderer`** to v2 (update API usage)
3. **Replace `node-fetch`** with native `fetch()`
4. **Replace `rimraf`** with `fs.rm`
5. **Replace `react-helmet`** with `react-helmet-async`
6. **Update `react-query`** to `@tanstack/react-query` v5
7. **Replace `xdm`** with `@mdx-js/mdx` v3
8. **Update `react-router-dom`** to v7 (evaluate breaking changes)
9. **Update `downshift`** to v9
10. **Update Radix UI** packages to latest
11. **Expand React peer deps** to include ^19.0.0-0

### Phase 4: Major migration (significant code changes)

1. **Replace `@stitches/react`** — This is the largest single migration:
   - 30+ files, 83+ styled components
   - SSR integration rework
   - Theme system migration
   - Estimated scope: Complete rewrite of `@showroomjs/ui` styling layer
   - Recommended target: Panda CSS (official migration guide available)
2. **Remove/replace CRA example** — CRA is deprecated
3. **Evaluate Webpack → Vite migration** for dev server (optional, high effort)

---

## Dependency Graph of Updates

```
Phase 1 (config only)
  └── Phase 2 (build tools)
        ├── Phase 3 (library updates) ── can partially overlap
        └── Phase 4 (Stitches migration) ── independent track
```

Phases 1 and 2 are prerequisites for phases 3 and 4. Phases 3 and 4 can proceed in parallel on separate branches.
