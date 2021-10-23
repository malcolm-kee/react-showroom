// @ts-check
const { defineConfig } = require('react-showroom');
const libPackageJson = require('react-showroom/package.json');

module.exports = defineConfig({
  url: 'https://react-showroom.js.org',
  require: ['tailwindcss/tailwind.css'],
  items: [
    {
      type: 'content',
      path: '',
      content: 'docs/index.mdx',
    },
    {
      type: 'components',
      path: 'components',
      components: './docs/components/*.tsx',
      hideFromSidebar: true,
    },
    {
      type: 'content',
      path: 'markdown-example',
      content: 'docs/markdown-example.mdx',
      hideFromSidebar: true,
    },
    {
      type: 'group',
      title: 'Getting Started',
      items: [
        {
          type: 'content',
          content: 'docs/installation.md',
        },
        {
          type: 'content',
          content: 'docs/documenting-components.mdx',
        },
        {
          type: 'content',
          content: 'docs/documenting-others.mdx',
        },
      ],
    },
    {
      type: 'group',
      title: 'API',
      items: [
        {
          type: 'content',
          content: 'docs/configuration.md',
        },
      ],
    },
    {
      type: 'group',
      title: 'Examples',
      items: [
        {
          type: 'link',
          href: 'https://react-showroom-prerender.netlify.app/',
          title: 'Prerender Example',
        },
        {
          type: 'link',
          href: 'https://react-showroom-spa.netlify.app/',
          title: 'Disable Prerender Example',
        },
        {
          type: 'link',
          href: 'https://react-showroom-subpath.netlify.app/',
          title: 'Subpath Example',
        },
      ],
    },
  ],
  theme: {
    title: 'React Showroom',
    resetCss: false,
    navbar: {
      version: libPackageJson.version,
      items: [
        {
          to: '/getting-started/installation',
          label: 'Docs',
        },
        {
          to: libPackageJson.repository.url.replace(/^git\+/, ''),
          label: 'GitHub',
          showInMobileMenu: true,
        },
      ],
      logo: {
        src: '/react-showroom.png',
        alt: '',
        height: '83',
        width: '79',
      },
    },
    colors: {
      'primary-50': '#ECFDF5',
      'primary-100': '#D1FAE5',
      'primary-200': '#A7F3D0',
      'primary-300': '#6EE7B7',
      'primary-400': '#34D399',
      'primary-500': '#10B981',
      'primary-600': '#059669',
      'primary-700': '#047857',
      'primary-800': '#065F46',
      'primary-900': '#064E3B',
    },
    favicon: '/icon.png',
  },
  devServer: {
    port: 8989,
  },
  assetDir: 'assets',
});
