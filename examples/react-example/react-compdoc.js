// @ts-check
const webpackConfig = require('./webpack.config');

/**
 * @type {import('react-compdoc').ReactCompdocConfiguration}
 */
const config = {
  components: 'src/components/**/*.tsx',
  webpackConfig,
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
};

module.exports = config;
