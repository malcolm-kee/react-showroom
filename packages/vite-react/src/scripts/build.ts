import { buildShowroom } from '../node-api/build-showroom';
import { argv } from 'yargs';

buildShowroom(undefined, (argv as any).config);
