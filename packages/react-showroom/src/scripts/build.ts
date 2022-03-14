import { buildShowroom } from '../node-api/build-showroom';
import { argv } from 'yargs';

(async function runBuild() {
  await buildShowroom(
    undefined,
    (argv as any).config,
    (argv as any).profile,
    (argv as any).measure
  );
  process.exit(0);
})();
