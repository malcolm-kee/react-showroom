// @ts-check

/**
 * @type {import('react-compdoc').ReactCompdocConfiguration}
 */
const config = {
  components: 'src/components/**/*.tsx',
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
