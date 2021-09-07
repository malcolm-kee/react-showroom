// @ts-check
const webpackConfig = require('./webpack.config');
const { defineConfig } = require('react-compdoc');

module.exports = defineConfig({
  sections: [
    {
      content: 'README.md',
    },
    {
      title: 'Core',
      components: 'src/components/**/*.tsx',
    },
    {
      title: 'GitHub',
      href: 'https://github.com/malcolm-kee/react-compdoc',
    },
    {
      content: 'docs/about.md',
    },
  ],
  webpackConfig,
  title: 'React Compdoc Example',
  imports: [
    {
      name: 'components',
      path: './src/components',
    },
    {
      name: 'react',
      path: 'react',
    },
  ],
  prerender: true,
});
