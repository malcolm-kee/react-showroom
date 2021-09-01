#!/usr/bin/env node

import * as spawn from 'cross-spawn';
import * as yargs from 'yargs';
import * as path from 'path';
const pkgJson = require(path.resolve(__dirname, '../../package.json'));

process.on('unhandledRejection', (err) => {
  throw err;
});

yargs
  .scriptName(pkgJson.name)
  .version(pkgJson.version)
  .usage('$0 <cmd> [args]')
  .command(
    '$0',
    false,
    () => {},
    () => yargs.showHelp('log')
  )
  .command(
    'dev',
    'Start compdoc development server',
    {
      port: {
        type: 'number',
        describe: 'Port number for the dev server',
        default: 6969,
      },
    },
    () => spawnScript('dev', process.argv.slice(3))
  )
  .command('build', 'Build compdoc static site', {}, () =>
    spawnScript('build', process.argv.slice(3))
  )
  .help().argv;

function spawnScript(scriptName: string, argv: ReadonlyArray<string> = []) {
  const result = spawn.sync(
    process.execPath,
    [require.resolve(`../scripts/${scriptName}`)].concat(argv),
    {
      stdio: 'inherit',
    }
  );

  if (result.signal) {
    handleSignal(result.signal);
    process.exit(1);
  }

  process.exit(result.status!);
}

function handleSignal(signal: NodeJS.Signals) {
  if (signal === 'SIGKILL') {
    console.log(
      'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    );
  } else if (signal === 'SIGTERM') {
    console.log(
      'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    );
  }
  process.exit(1);
}
