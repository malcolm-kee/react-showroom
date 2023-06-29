import { expect, test } from '@playwright/test';

test.describe('subpath example', () => {
  test('visit home page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Prerender', { exact: true }).click();
    await expect(
      page.getByText('React Showroom Subpath Example')
    ).toBeVisible();

    await page.goto('/');
    await page.getByText('Without prerender').click();
    await expect(
      page.getByText('React Showroom Without Prerender')
    ).toBeVisible();

    await page.goto('/');
    await page.getByText('Subpath by arguments').click();
    await expect(
      page.getByText('React Showroom Subpath Example')
    ).toBeVisible();
  });

  test('static is served correctly', async ({ page }) => {
    const mswMsg = '[MSW] Mocking enabled';
    const consoleMessages: Array<string> = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    await page.goto('/');
    await page.getByText('Prerender', { exact: true }).click();
    await page.getByText('Button').click();

    await expect(page.getByAltText('Icon')).toBeVisible();

    await new Promise<void>(function ensureMswSetup(fulfill) {
      if (consoleMessages.some((msg) => msg.includes(mswMsg))) {
        return fulfill();
      }

      return page
        .waitForEvent('console', (msg) => msg.text().includes(mswMsg))
        .then(() => fulfill());
    });

    await page.evaluate(() => {
      document.body.scrollTop = 500;
    });

    async function clickButtonAndVerifyResult(retryCount = 0) {
      try {
        await page.click('button:has-text("Fetch Data")');
        await expect(page.locator('text=Result:world')).toBeVisible({
          timeout: 3000,
        });
      } catch (error) {
        console.log(error);
        if (retryCount <= 3) {
          await new Promise((fulfill) => setTimeout(fulfill, 1000));
          await clickButtonAndVerifyResult(retryCount + 1);
        } else {
          throw error;
        }
      }
    }

    await clickButtonAndVerifyResult();
  });
});
