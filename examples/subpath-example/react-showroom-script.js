const { buildShowroom } = require('react-showroom');
const config = require('./react-showroom.config');

buildShowroom({
  ...config,
  build: {
    basePath: '/showroom-spa',
    outDir: 'public/showroom-spa',
    prerender: false,
  },
  theme: {
    title: 'React Showroom SPA',
  },
});
