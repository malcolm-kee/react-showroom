// @ts-check
const { defineConfig } = require('react-showroom');

module.exports = defineConfig({
  require: ['tailwindcss/tailwind.css'],
  devServer: {
    port: 7878,
  },
  build: {
    prerender: false,
  },
  example: {
    widths: [375, 768, 1440],
  },
});
