import type { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
// import webpack from 'webpack';
// import { createSsrWebpackConfig } from '../config/create-webpack-config';
import { rspack } from '@rspack/core';
import { createSsrRspackConfig } from '../config/create-rspack-config';

export async function outputSSrBundle(
  config: NormalizedReactShowroomConfiguration,
  tmpDir: string,
  profile = false,
  measure = false
) {
  const webpackConfig = createSsrRspackConfig('production', config, {
    outDir: tmpDir,
    profileWebpack: profile,
    measure,
  });

  const compiler = rspack(webpackConfig);

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
