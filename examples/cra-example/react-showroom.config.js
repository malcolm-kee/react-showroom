const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  require: ['./src/index.css'],
  componentsEntry: {
    name: 'components',
    path: './src/components/index.ts',
  },
  theme: {
    title: 'CRA 5 Example',
  },
  experiments: {
    interactions: true,
  },
});
