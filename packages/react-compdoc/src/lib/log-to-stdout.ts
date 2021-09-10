import chalk from 'chalk';

export const logToStdout = (msg: string) =>
  console.log(`${chalk.magentaBright('React compdoc')} ${msg}`);
