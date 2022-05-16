import { expect, test, errors } from '@playwright/test';

test.describe('subpath example', () => {
  test('visit home page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Prerender');

    const title = page.locator('text=React Showroom Subpath Example');
    await expect(title).toBeVisible();

    await page.goto('/');
    await page.click('text=Without prerender');

    const secondTitle = page.locator('text=React Showroom Without Prerender');
    await expect(secondTitle).toBeVisible();
  });

  test('static is served correctly', async ({ page }) => {
    const mswMsg = '[MSW] Mocking enabled';
    const consoleMessages: Array<string> = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    await page.goto('/');
    await page.click('text=Prerender');
    await page.click('text=Button');

    const image = page.locator('[alt="Icon"]');
    await expect(image).toBeVisible();

    await new Promise<void>(function ensureMswSetup(fulfill) {
      if (consoleMessages.some((msg) => msg.includes(mswMsg))) {
        return fulfill();
      }

      return page.waitForEvent('console', (msg) => msg.text().includes(mswMsg));
    });

    await page.evaluate(() => {
      document.body.scrollTop = 500;
    });

    async function clickButtonAndVerifyResult(retry = 0) {
      try {
        await page.click('button:has-text("Fetch Data")');
        await expect(page.locator('text=Result:world')).toBeVisible();
      } catch (error) {
        if (error instanceof errors.TimeoutError && retry <= 2) {
          await clickButtonAndVerifyResult(retry + 1);
        } else {
          throw error;
        }
      }
    }

    await clickButtonAndVerifyResult();
  });
});
