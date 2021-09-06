// @ts-check
const webpackConfig = require('./webpack.config');

/**
 * @type {import('react-compdoc').ReactCompdocConfiguration}
 */
const config = {
  sections: [
    {
      title: 'Introduction to Example',
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
};

module.exports = config;
