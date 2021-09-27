import { magenta } from 'nanocolors';

export const logToStdout = (msg: string) =>
  console.log(`${magenta('React Showroom')} ${msg}`);
