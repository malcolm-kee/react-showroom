import type { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { createClientWebpackConfig } from '../config/create-webpack-config';

type DevServerConfig = webpackDevServer.Configuration;

export const createDevServer = (
  config: NormalizedReactShowroomConfiguration,
  options: { measure?: boolean; host: string; port: number }
) => {
  const { assetDir, basePath } = config;

  const webpackConfig = createClientWebpackConfig('development', config, {
    measure: options.measure,
    operation: 'serve',
  });
  const devServerOptions = Object.assign<DevServerConfig, DevServerConfig>(
    {
      port: options.port,
      host: options.host,
      client: {
        logging: 'none',
      },
      hot: true,
      historyApiFallback: {
        rewrites: [
          {
            from: new RegExp(`^\\${basePath}/_preview/`),
            to: `${basePath}/_preview.html`,
          },
          { from: /./, to: `${basePath}/index.html` },
        ],
      },
    },
    assetDir
      ? {
          static: {
            directory: assetDir,
            watch: true,
            publicPath: `${config.basePath}/`,
          },
        }
      : {}
  );

  const compiler = webpack(webpackConfig);

  const server = new webpackDevServer(devServerOptions, compiler);

  return server;
};
