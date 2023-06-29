import { expect, test } from '@playwright/test';
import path from 'path';

test.describe('props editor', () => {
  test('props editor should works', async ({ page }) => {
    await page.goto('/core/button');

    await page.waitForFunction(
      () => document.querySelectorAll('iframe').length >= 3
    );

    const allFrames = page.mainFrame().childFrames();

    const firstFrame = allFrames[0];

    await expect(firstFrame.locator('button')).toHaveText('Hello');

    await page.getByLabel('children').fill('Hello Whurt');

    await expect(firstFrame.locator('button')).toHaveText('Hello Whurt');

    await page.getByLabel('className').fill('w-full');

    await expect(firstFrame.locator('button')).toHaveClass(/w-full/);
  });

  test('props editor for complex prop', async ({ page }) => {
    await page.goto('/core/imageviewer');

    await page.waitForSelector('h1:has-text("ImageViewer")');

    const firstFrame = page.mainFrame().childFrames()[0];

    await firstFrame.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: '(file)' }).click();

    await page.setInputFiles(
      'input[type="file"]',
      path.resolve(__dirname, 'amei.jpeg')
    );
  });
});
