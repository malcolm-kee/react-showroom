const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  build: {
    basePath: '/some-subpath',
    outDir: 'public/some-subpath',
  },
});
