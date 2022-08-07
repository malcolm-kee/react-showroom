// @ts-check
const path = require('path');
const { defineConfig } = require('react-showroom');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = defineConfig(() => ({
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
    serviceWorker: false,
  },
  example: {
    syncStateType: 'event',
  },
  componentsEntry: {
    name: 'components',
    path: './src/components/index.ts',
  },
  docgen: {
    tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
  },
  html: {
    showroom: {
      publicPath: false,
      scripts: [
        {
          path: 'https://cdn.tailwindcss.com?plugins=forms',
          attributes: { defer: false },
        },
      ],
      append: false,
    },
    preview: {
      publicPath: false,
      scripts: [
        {
          path: 'https://cdn.tailwindcss.com?plugins=forms',
          attributes: { defer: false },
        },
      ],
      append: false,
    },
  },
  assetDir: 'public',
  wrapper: 'docs/provider.tsx',
  webpackConfig: {
    plugins: [new VanillaExtractPlugin()],
  },
}));
