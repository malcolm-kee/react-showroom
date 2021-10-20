const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  imports: [
    {
      name: '@components',
      path: './src/components',
    },
  ],
  build: {
    basePath: '/some-subpath',
    outDir: 'public/some-subpath',
  },
});
