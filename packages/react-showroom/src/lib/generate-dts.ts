import { isDefined } from '@showroomjs/core';
import { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import * as fs from 'fs';
import * as path from 'path';
import * as tsup from 'tsup';
import { green, logToStdout } from './log-to-stdout';
import { paths, resolveApp } from './paths';

export const generateDts = async (
  { docgen, componentsEntry, cacheDir }: NormalizedReactShowroomConfiguration,
  watch: boolean
) => {
  if (
    componentsEntry &&
    componentsEntry.path &&
    !isDefined(componentsEntry.dts)
  ) {
    logToStdout(`Generating d.ts for ${componentsEntry.path}...`);

    const name = path.parse(componentsEntry.path).name;

    await tsup.build({
      entryPoints: [resolveApp(componentsEntry.path)],
      outDir: path.resolve(cacheDir, 'dts'),
      watch,
      clean: !watch,
      silent: true,
      dts: {
        only: true,
        resolve: true,
      },
      tsconfig: path.isAbsolute(docgen.tsconfigPath)
        ? path.relative(paths.appPath, docgen.tsconfigPath)
        : docgen.tsconfigPath,
      config: false,
    });

    await waitFileExist(path.resolve(cacheDir, 'dts', `${name}.d.ts`));

    logToStdout(green(`Generated d.ts for ${componentsEntry.path}.`));
  }
};

async function waitFileExist(path: string, timeout = 20000) {
  let totalTime = 0;
  let checkTime = timeout / 10;

  return await new Promise((resolve) => {
    const timer = setInterval(function () {
      totalTime += checkTime;

      let fileExists = fs.existsSync(path);

      if (fileExists || totalTime >= timeout) {
        clearInterval(timer);

        resolve(fileExists);
      }
    }, checkTime);
  });
}
