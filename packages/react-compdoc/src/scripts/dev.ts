// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import * as webpack from 'webpack';
import { argv } from 'yargs';
import { createWebpackConfig } from '../config/create-webpack-config';

const webpackDevServer = require('webpack-dev-server');

(async function startDevServer() {
  const PORT = Number((argv as any).port ?? process.env.PORT ?? 6969);

  const webpackConfig = await createWebpackConfig('development');

  const devServerOptions = {
    port: PORT,
    host: '0.0.0.0',
    client: {
      logging: 'none',
    },
    // hot: true, // hot reload replacement not supported for module federation
    historyApiFallback: true,
  };

  const compiler = webpack(webpackConfig);

  const server = new webpackDevServer(devServerOptions, compiler);

  await server.start();
})();
