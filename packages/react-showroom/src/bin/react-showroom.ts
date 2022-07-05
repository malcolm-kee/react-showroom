#!/usr/bin/env node

import cac from 'cac';
import * as path from 'path';

const pkgJson = require(path.resolve(__dirname, '../../package.json'));

process.on('unhandledRejection', (err) => {
  throw err;
});

const cli = cac(pkgJson.name).version(pkgJson.version);

cli
  .command('dev', 'Start showroom development server')
  .option('port <port>', 'Port number for the dev server', {
    default: 6969,
  })
  .option('config <file>', 'Config file name', {
    default: 'react-showroom.config.js',
  })
  .option('measure', 'Whether to measure webpack build performance')
  .action((options) => {
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';

    return import('../node-api/start-dev-server')
      .then(({ startDevServer }) =>
        startDevServer(undefined, options.config, options.measure, options.port)
      )
      .catch(console.error);
  });

cli
  .command('build', 'Build showroom static site')
  .option('config <file>', 'Config file name', {
    default: 'react-showroom.config.js',
  })
  .option('basePath <path>', 'Base path for site')
  .option('outDir <dir>', 'Output folder for the generated site')
  .option('profile', 'Whethere to generate profile file')
  .option('measure', 'Whether to measure webpack build performance')
  .action((options) => {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';

    return import('../node-api/build-showroom')
      .then(({ buildShowroom }) =>
        buildShowroom(
          undefined,
          options.config,
          options.profile,
          options.measure,
          {
            outDir: options.outDir,
            basePath: options.basePath,
          }
        )
      )
      .then(() => process.exit(0))
      .catch(console.error);
  });

cli.help();

cli.command('').action(() => cli.outputHelp());

cli.parse();
