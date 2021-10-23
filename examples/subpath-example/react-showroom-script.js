const { buildShowroom } = require('react-showroom');
const config = require('./react-showroom.config');

buildShowroom({
  ...config,
  build: {
    basePath: '/no-prerender',
    outDir: 'public/no-prerender',
    prerender: false,
  },
  theme: {
    title: 'React Showroom Without Prerender',
  },
});
