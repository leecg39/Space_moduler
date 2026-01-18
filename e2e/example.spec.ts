import { test, expect } from '@playwright/test';

test.describe('Space Moduler E2E', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h2')).toContainText('Space Moduler');
  });

  test('should show upload button on landing page', async ({ page }) => {
    await page.goto('/');

    const uploadButton = page.locator('button:has-text("시작하기")');
    await expect(uploadButton).toBeVisible();
  });

  test('should navigate through application flow', async ({ page }) => {
    await page.goto('/');

    // Check landing page elements
    await expect(page.locator('text=어떤 평면도라도 즉시')).toBeVisible();

    // Note: Full flow test would require actual file upload and API mocking
    // This is a basic structure for E2E tests
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toContain('Space Moduler');
  });
});
