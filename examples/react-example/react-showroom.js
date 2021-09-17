// @ts-check
const path = require('path');
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
  theme: {
    title: 'React Showroom Example',
  },
  imports: [
    {
      name: 'components',
      path: './src/components',
    },
  ],
  build: {
    prerender: true,
  },
  docgen: {
    tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
  },
  assetDirs: ['public'],
  wrapper: 'docs/provider.tsx',
});
