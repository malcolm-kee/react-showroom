// @ts-check
const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  componentsEntry: {
    name: '@components',
    path: './src/components',
    dts: './component-dts/index.d.ts',
  },
  build: {
    basePath: '/some-subpath',
    outDir: 'public/some-subpath',
  },
});
