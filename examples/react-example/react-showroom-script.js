const { buildShowroom } = require('react-showroom');
const config = require('./react-showroom');

buildShowroom({
  ...config,
  build: {
    outDir: 'showroom-spa',
  },
  theme: {
    title: 'React Showroom SPA',
  },
});
