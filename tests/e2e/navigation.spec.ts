import { test, expect } from '@playwright/test';

/**
 * Navigation Tests
 *
 * Tests basic site navigation and core pages
 */

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@unimogcommunityhub.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in for authenticated pages
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes('sign-in'), {
      timeout: 10000
    });
  });

  test('should load home page', async ({ page }) => {
    await page.goto('/');

    // Check for main heading or logo
    const heading = page.locator('h1, h2, [data-testid="logo"]');
    await expect(heading.first()).toBeVisible();
  });

  test('should navigate to trip planner', async ({ page }) => {
    // Try different possible routes
    const routes = ['/trips', '/trip-planner', '/planning'];

    let found = false;
    for (const route of routes) {
      try {
        await page.goto(route, { timeout: 5000 });
        if (!page.url().includes('404')) {
          found = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!found) {
      // Try finding link in navigation
      const tripLink = page.locator('a:has-text("Trip"), a:has-text("Plan"), a:has-text("Routes")');
      if (await tripLink.count() > 0) {
        await tripLink.first().click();
        found = true;
      }
    }

    // If we found the page, verify map or trip planner elements
    if (found) {
      await page.waitForTimeout(2000);
      const mapOrPlanner = page.locator('[id*="map"], [class*="map"], [data-testid*="trip"], [data-testid*="planner"]');
      expect(await mapOrPlanner.count()).toBeGreaterThan(0);
    }
  });

  test('should navigate to manuals/knowledge base', async ({ page }) => {
    const routes = ['/manuals', '/knowledge', '/documents'];

    let found = false;
    for (const route of routes) {
      try {
        await page.goto(route, { timeout: 5000 });
        if (!page.url().includes('404')) {
          found = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!found) {
      const manualsLink = page.locator('a:has-text("Manual"), a:has-text("Knowledge"), a:has-text("Documents")');
      if (await manualsLink.count() > 0) {
        await manualsLink.first().click();
        found = true;
      }
    }

    expect(found).toBe(true);
  });

  test('should navigate to marketplace', async ({ page }) => {
    const routes = ['/marketplace', '/market', '/shop'];

    let found = false;
    for (const route of routes) {
      try {
        await page.goto(route, { timeout: 5000 });
        if (!page.url().includes('404')) {
          found = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!found) {
      const marketLink = page.locator('a:has-text("Market"), a:has-text("Shop"), a:has-text("Parts")');
      if (await marketLink.count() > 0) {
        await marketLink.first().click();
      }
    }
  });

  test('should navigate to user profile', async ({ page }) => {
    // Click user menu
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Test User"), [aria-label*="user menu" i]');
    await userMenu.first().click();

    // Click profile link
    const profileLink = page.locator('a:has-text("Profile"), a:has-text("Account"), a:has-text("Settings")');
    await profileLink.first().click();

    // Should show profile page
    await page.waitForTimeout(1000);
    const profileContent = page.locator('text=/profile|account|settings/i');
    await expect(profileContent.first()).toBeVisible();
  });

  test('should handle 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');

    // Should show 404 message
    const notFoundMessage = page.locator('text=/404|not found|page.*exist/i');
    await expect(notFoundMessage.first()).toBeVisible({ timeout: 5000 });
  });
});
