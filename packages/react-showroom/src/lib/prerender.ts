import { Ssr } from '@showroomjs/core';
import { NormalizedReactShowroomConfiguration } from '@showroomjs/core/react';
import * as fs from 'fs-extra';
import { logToStdout } from './log-to-stdout';
import { resolveApp } from './paths';

/**
 *
 * @returns number of pre-rendered pages
 */
export async function prerenderSite(
  config: NormalizedReactShowroomConfiguration,
  tmpDir: string
): Promise<number> {
  const prerenderCodePath = `${tmpDir}/server/prerender.js`;
  const htmlPath = resolveApp(`${config.outDir}/index.html`);

  const { ssr } = require(prerenderCodePath) as { ssr: Ssr };

  const template = await fs.readFile(htmlPath, 'utf-8');

  const routes = await ssr.getRoutes();

  if (config.basePath !== '') {
    logToStdout(`Prerender with basePath: ${config.basePath}`);
  }

  let pageCount = 0;

  for (const route of routes) {
    if (route !== '') {
      pageCount++;

      try {
        await fs.outputFile(
          resolveApp(`${config.outDir}/${route}index.html`),
          await getHtml(`/${route}`)
        );
      } catch (error) {
        console.group(`Error while prerendering ${route}`);
        console.error(error);
        console.groupEnd();
      }
    }
  }

  await fs.outputFile(
    resolveApp(`${config.outDir}/_offline.html`),
    await getHtml('/_offline')
  );

  await fs.outputFile(htmlPath, await getHtml('/'));

  async function getHtml(pathname: string) {
    const prerenderResult = await ssr.render({ pathname });
    const helmet = ssr.getHelmet();
    const finalHtml = template
      .replace(
        '<!--SSR-style-->',
        `<style id="stitches">${ssr.getCssText()}</style>`
      )
      .replace(
        '<!--SSR-helmet-->',
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
      )
      .replace('<!--SSR-target-->', prerenderResult.result);

    prerenderResult.cleanup();

    return finalHtml;
  }

  return pageCount + 1;
}

/**
 *
 * @returns number of pre-rendered pages
 */
export async function prerenderPreview(
  config: NormalizedReactShowroomConfiguration,
  tmpDir: string
): Promise<number> {
  const prerenderCodePath = `${tmpDir}/server/previewPrerender.js`;
  const htmlPath = resolveApp(`${config.outDir}/_preview.html`);

  const { ssr } = require(prerenderCodePath) as { ssr: Ssr };

  const template = await fs.readFile(htmlPath, 'utf-8');

  const routes = await ssr.getRoutes();

  let pageCount = 0;

  for (const route of routes) {
    if (route !== '') {
      pageCount++;

      try {
        await fs.outputFile(
          resolveApp(`${config.outDir}/_preview/${route}index.html`),
          await getHtml(`/${route}`)
        );
      } catch (error) {
        console.group(`Error while prerendering ${route}`);
        console.error(error);
        console.groupEnd();
      }
    }
  }

  async function getHtml(pathname: string) {
    const prerenderResult = await ssr.render({ pathname });
    const helmet = ssr.getHelmet();
    const finalHtml = template
      .replace(
        '<!--SSR-style-->',
        `<style id="stitches">${ssr.getCssText()}</style>`
      )
      .replace(
        '<!--SSR-helmet-->',
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
      )
      .replace('<!--SSR-target-->', prerenderResult.result);

    prerenderResult.cleanup();

    return finalHtml;
  }

  return pageCount;
}
