/*
 * This script should be run in separate thread using child_process.fork
 * to improve performance.
 */

import { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import webpack from 'webpack';
import { createSsrWebpackConfig } from '../config/create-webpack-config';

export async function createSSrBundle(
  config: NormalizedReactShowroomConfiguration,
  tmpDir: string
) {
  const webpackConfig = createSsrWebpackConfig('production', config, {
    outDir: tmpDir,
  });

  const compiler = webpack(webpackConfig);

  await new Promise<void>((fulfill, reject) => {
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        if (err) {
          console.error(err);
        }
        compiler.close(() => {
          console.error('Fix the error and try again.');
        });

        reject(err || new Error(stats?.toString()));
      }

      compiler.close(() => {
        fulfill();
      });
    });
  });
}
