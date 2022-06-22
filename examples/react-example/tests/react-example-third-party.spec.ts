import { expect, test } from '@playwright/test';

test.describe('react example third party integration', () => {
  test('msw mock should work', async ({ page }) => {
    await page.goto('/core/button');

    await page.click('button:has-text("Fetch Data")');

    await expect(page.locator('text=Result intercepted by msw!')).toBeVisible();
  });
});
