// @ts-check
const { defineConfig } = require('react-showroom');
const libPackageJson = require('react-showroom/package.json');

module.exports = defineConfig({
  url: 'https://react-showroom.js.org',
  require: ['tailwindcss/tailwind.css', './docs/styles.css'],
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
      content: 'docs/documenting-others/markdown-example.mdx',
      hideFromSidebar: true,
    },
    {
      type: 'content',
      path: 'markdown-code-example',
      content: 'docs/documenting-others/markdown-code-example.mdx',
      hideFromSidebar: true,
    },
    {
      type: 'content',
      path: 'button-other-example',
      content: 'docs/documenting-components/button-other-example.mdx',
      hideFromSidebar: true,
      _associatedComponentName: 'Button',
    },
    {
      type: 'content',
      path: 'button-union-example',
      content: 'docs/documenting-components/button-union-example.mdx',
      hideFromSidebar: true,
      _associatedComponentName: 'Button',
    },
    {
      type: 'content',
      path: 'button-playground-example',
      content: 'docs/component-playground/button-playground-example.mdx',
      hideFromSidebar: true,
      _associatedComponentName: 'Button',
    },
    {
      type: 'content',
      path: 'button-playground-example-2',
      content: 'docs/component-playground/button-playground-example-2.mdx',
      hideFromSidebar: true,
      _associatedComponentName: 'Button',
    },
    {
      type: 'content',
      path: 'button-playground-control-options',
      content: 'docs/component-playground/control-options.mdx',
      hideFromSidebar: true,
      _associatedComponentName: 'Button',
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
          content: 'docs/component-playground.mdx',
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
          content: 'docs/configuration.mdx',
        },
      ],
    },
    {
      type: 'group',
      title: 'Examples',
      items: [
        {
          type: 'link',
          href: 'https://react-showroom-cra5-example.netlify.app/',
          title: 'CRA 5 Example',
        },
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
    audienceToggle: 'code',
  },
  devServer: {
    port: 8989,
  },
  assetDir: 'assets',
});
