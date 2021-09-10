// @ts-check
const webpackConfig = require('./webpack.config');
const { defineConfig } = require('react-compdoc');

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
      href: 'https://github.com/malcolm-kee/react-compdoc',
    },
    {
      type: 'docs',
      folder: 'docs',
    },
  ],
  webpackConfig,
  title: 'React Compdoc Example',
  imports: [
    {
      name: 'components',
      path: './src/components',
    },
    'react-hook-form',
  ],
  prerender: true,
});
