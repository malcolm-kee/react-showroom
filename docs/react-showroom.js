// @ts-check
const { defineConfig } = require('react-showroom');
const webpackConfig = require('./webpack.config');

module.exports = defineConfig({
  title: 'React Showroom',
  items: [
    {
      type: 'group',
      title: 'Getting Started',
      items: [
        {
          type: 'content',
          content: 'docs/installation.md',
        },
      ],
    },
    {
      type: 'group',
      title: 'API',
      items: [
        {
          type: 'content',
          content: 'docs/configuration.md',
        },
      ],
    },
  ],
  webpackConfig,
  devServer: {
    port: 8989,
  },
  build: {
    prerender: true,
  },
  wrapper: 'components/wrapper.tsx',
});
