// @ts-check
const webpackConfig = require('./webpack.config');
const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  items: [
    {
      type: 'components',
      title: 'Core',
      components: 'src/components/**/*.tsx',
    },
    {
      type: 'link',
      title: 'GitHub',
      href: 'https://github.com/malcolm-kee/react-showroom',
    },
    {
      type: 'docs',
      folder: 'docs',
    },
  ],
  webpackConfig,
  title: 'React Showroom Example',
  imports: [
    {
      name: 'components',
      path: './src/components',
    },
    'react-hook-form',
  ],
  prerender: true,
  assetDirs: ['public'],
  wrapper: 'docs/provider.tsx',
});
