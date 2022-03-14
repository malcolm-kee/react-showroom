import { startDevServer } from '../node-api/start-dev-server';
import { argv } from 'yargs';

startDevServer(undefined, (argv as any).config, (argv as any).measure);
