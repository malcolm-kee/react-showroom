import { omit } from '@showroomjs/core';
import type { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import * as fs from 'fs-extra';
import * as path from 'path';
// import webpack from 'webpack';
// import { createClientWebpackConfig } from '../config/create-webpack-config';
import { rspack } from '@rspack/core';
import { createClientRspackConfig } from '../config/create-rspack-config';
import { resolveApp } from './paths';

export async function outputClientBundle(
  config: NormalizedReactShowroomConfiguration,
  profile = false,
  measure = false
) {
  const webpackConfig = createClientRspackConfig('production', config, {
    outDir: config.outDir,
    profileWebpack: profile,
    measure,
    operation: 'build',
  });

  const compiler = rspack(webpackConfig);

  try {
    await new Promise<void>((fulfill, reject) => {
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          if (err) {
            console.error(err);
          }
          compiler.close(() => {
            console.error('Fix the error and try again.');
          });
          reject(err);
        }

        compiler.close(() => {
          fulfill();
        });
      });
    });

    const { manifest } = config.theme;

    if (manifest) {
      await fs.outputJSON(
        resolveApp(`${config.outDir}/manifest.json`),
        omit(manifest, ['baseIconPath'])
      );

      if (manifest.baseIconPath) {
        await fs.copy(
          resolveApp(manifest.baseIconPath),
          resolveApp(
            `${config.outDir}/_icons/${path.parse(manifest.baseIconPath).base}`
          )
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}
