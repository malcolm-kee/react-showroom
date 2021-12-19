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
  example: {
    dimensions: [
      'iPhone 6/7/8',
      'iPhone X',
      'iPad Mini',
      'iPad',
      'iPad Pro',
      'Galaxy Note 10',
      'Macbook Pro',
      'Macbook Air',
    ],
    syncStateType: 'event',
  },
});
