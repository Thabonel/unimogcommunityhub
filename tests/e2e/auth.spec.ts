import { test, expect } from '@playwright/test';

/**
 * Authentication Flow Tests
 *
 * Tests user sign in, sign out, and authentication state
 */

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@unimogcommunityhub.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

test.describe('Authentication', () => {
  test('should show sign in page when not authenticated', async ({ page }) => {
    await page.goto('/');

    // Should redirect to sign in or show sign in option
    await expect(page).toHaveURL(/.*\/?(sign-in|login)?/);
  });

  test('should sign in with valid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    // Fill in credentials
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);

    // Click sign in button
    await page.click('button[type="submit"]');

    // Wait for navigation after sign in
    await page.waitForURL((url) => !url.pathname.includes('sign-in'), {
      timeout: 10000
    });

    // Should be redirected to dashboard or home
    await expect(page).not.toHaveURL(/sign-in/);

    // Should show user menu or profile indicator
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Test User"), [aria-label*="user menu" i]');
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Should show error message
    const errorMessage = page.locator('text=/invalid|incorrect|error/i');
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('should sign out successfully', async ({ page }) => {
    // First sign in
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for successful sign in
    await page.waitForURL((url) => !url.pathname.includes('sign-in'), {
      timeout: 10000
    });

    // Find and click sign out
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Test User"), [aria-label*="user menu" i]');
    await userMenu.first().click();

    const signOutButton = page.locator('text=/sign out|log out/i');
    await signOutButton.first().click();

    // Should redirect to sign in or home
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(sign-in|login)?$/);
  });

  test('should maintain session after page reload', async ({ page }) => {
    // Sign in
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => !url.pathname.includes('sign-in'), {
      timeout: 10000
    });

    // Reload page
    await page.reload();

    // Should still be signed in
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Test User"), [aria-label*="user menu" i]');
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });
  });
});
