require('source-map-support').install();

import type { ReactShowroomConfiguration } from '@showroomjs/core/react';
import * as fs from 'fs-extra';
import { performance } from 'perf_hooks';
import { generateDts } from '../lib/generate-dts';
import { getConfig } from '../lib/get-config';
import { green, logToStdout } from '../lib/log-to-stdout';
import { outputClientBundle } from '../lib/output-client-bundle';
import { outputSSrBundle } from '../lib/output-ssr-bundle';
import { resolveApp, resolveShowroom } from '../lib/paths';
import { prerenderPreview, prerenderSite } from '../lib/prerender';

export async function buildShowroom(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string,
  profile?: boolean,
  measure?: boolean,
  {
    basePath,
    outDir,
  }: {
    basePath?: string;
    outDir?: string;
  } = {}
) {
  const config = getConfig('production', {
    configFile,
    userConfig,
    basePath,
    outDir,
  });

  if (config.example.enableAdvancedEditor) {
    await generateDts(config);
  }

  const ssrDir = resolveShowroom(
    `ssr-result-${Date.now() + performance.now()}`
  );

  try {
    if (profile) {
      await outputClientBundle(config, profile, measure);
      await outputSSrBundle(config, ssrDir, profile, measure);
    } else {
      await Promise.all([
        outputClientBundle(config, profile, measure),
        outputSSrBundle(config, ssrDir, profile, measure),
      ]);
      logToStdout('Prerendering...');
      const [sitePageCount, previewPageCount] = await Promise.all([
        prerenderSite(config, ssrDir),
        prerenderPreview(config, ssrDir),
      ]);
      logToStdout(
        green(`Prerendered ${sitePageCount + previewPageCount} pages.`)
      );
      logToStdout(`Generated showroom at`);
      logToStdout(`  -  ${green(resolveApp(config.outDir))}`);
    }
  } finally {
    await fs.remove(ssrDir);
  }
}
