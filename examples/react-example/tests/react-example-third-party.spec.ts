import { expect, test } from '@playwright/test';

test.describe('react example third party integration', () => {
  test('msw mock should work', async ({ page }) => {
    await page.goto('/core/button');

    async function clickButtonAndVerifyResult(retryCount = 0) {
      try {
        await page.click('button:has-text("Fetch Data")');

        await expect(
          page.locator('text=Result intercepted by msw!')
        ).toBeVisible({ timeout: 3000 });
      } catch (error) {
        if (retryCount <= 3) {
          console.log(error);
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
