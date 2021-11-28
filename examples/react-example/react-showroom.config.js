// @ts-check
const path = require('path');
const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  require: ['tailwindcss/tailwind.css', './src/custom.css'],
  items: [
    {
      type: 'content',
      content: 'docs/index.mdx',
      path: '',
    },
    {
      type: 'components',
      title: 'Core',
      description: 'Core components',
      components: 'src/components/*.tsx',
    },
    {
      type: 'components',
      title: 'Form Control',
      description: 'Components in Form',
      components: 'src/components/form-control/**/*.tsx',
    },
    {
      type: 'link',
      title: 'GitHub',
      href: 'https://github.com/malcolm-kee/react-showroom',
    },
    {
      title: 'Others',
      type: 'docs',
      folder: 'docs',
      ignores: ['**/index.mdx'],
      formatLabel: (t) => `Docs: ${t}`,
    },
  ],
  skipEmptyComponent: true,
  theme: {
    title: 'React Showroom Example',
    resetCss: false,
  },
  componentsEntry: {
    name: 'components',
    path: './src/components',
  },
  docgen: {
    tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
  },
  assetDir: 'public',
  wrapper: 'docs/provider.tsx',
});
