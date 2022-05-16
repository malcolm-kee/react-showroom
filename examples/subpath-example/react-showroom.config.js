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
  assetDir: 'static',
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
  theme: {
    title: 'React Showroom Subpath Example',
    manifest: {
      short_name: 'Subpath Example',
      baseIconPath: './static/react-showroom.png',
    },
  },
  wrapper: './src/docs/showroom-provider.tsx',
});
