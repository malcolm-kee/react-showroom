/*
 * This script should be run in separate thread using child_process.fork
 * to improve performance.
 */

import webpack from 'webpack';
import { createPrerenderWebpackConfig } from '../config/create-webpack-config';

if (process.send) {
  (async function run() {
    const tmpDir = process.argv[2];

    const webpackConfig = createPrerenderWebpackConfig('production', {
      outDir: tmpDir,
    });

    const compiler = webpack(webpackConfig);

    await new Promise<void>((fulfill) => {
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          if (err) {
            console.error(err);
          }
          compiler.close(() => {
            console.error('Fix the error and try again.');
          });
          if (process.send) {
            process.send(false);
          }
          fulfill();
        }

        compiler.close(() => {
          if (process.send) {
            process.send(true);
          }
          fulfill();
        });
      });
    });
  })();
} else {
  console.error('This script should only be run as child_process.fork');
  process.exit(1);
}
