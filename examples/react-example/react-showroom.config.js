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
  theme: {
    title: 'React Showroom Example',
  },
  imports: [
    {
      name: 'components',
      path: './src/components',
    },
  ],
  docgen: {
    tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
  },
  // html: {
  //   preview: {
  //     scripts: [
  //       {
  //         path: 'http://localhost:8097', // can use this to inject connect to standalone `react-devtools`.
  //         usePublicPath: false,
  //         append: false,
  //       },
  //     ],
  //   },
  // },
  assetDir: 'public',
  wrapper: 'docs/provider.tsx',
});
