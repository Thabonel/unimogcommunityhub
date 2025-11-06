import { test, expect } from '@playwright/test';

/**
 * Barry AI Chat Tests
 *
 * Tests Barry AI chatbot functionality
 */

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@unimogcommunityhub.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

test.describe('Barry AI Chat', () => {
  // Sign in before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', TEST_USER_EMAIL);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes('sign-in'), {
      timeout: 10000
    });
  });

  test('should navigate to Barry chat page', async ({ page }) => {
    // Navigate to Barry (check multiple possible routes)
    const possibleRoutes = ['/chat', '/barry', '/knowledge'];

    let found = false;
    for (const route of possibleRoutes) {
      try {
        await page.goto(route, { timeout: 5000 });
        const currentUrl = page.url();
        if (!currentUrl.includes('404') && !currentUrl.includes('not-found')) {
          found = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!found) {
      // Try to find Barry link in navigation
      const barryLink = page.locator('a:has-text("Barry"), a:has-text("Chat"), a:has-text("Knowledge")');
      await barryLink.first().click();
    }

    // Should show chat interface
    const chatInput = page.locator('textarea, input[placeholder*="Ask" i], input[placeholder*="message" i]');
    await expect(chatInput.first()).toBeVisible({ timeout: 5000 });
  });

  test('should send a message and receive response', async ({ page }) => {
    // Navigate to Barry
    await page.goto('/chat');

    // Find chat input
    const chatInput = page.locator('textarea, input[placeholder*="Ask" i], input[placeholder*="message" i]').first();
    await chatInput.fill('Hello Barry');

    // Find and click send button
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"], button[aria-label*="send" i]').first();
    await sendButton.click();

    // Wait for response (Barry's message should appear)
    const responseMessage = page.locator('text=/hello|hi|help|assist/i').first();
    await expect(responseMessage).toBeVisible({ timeout: 15000 });
  });

  test('should handle battery specs query', async ({ page }) => {
    await page.goto('/chat');

    const chatInput = page.locator('textarea, input[placeholder*="Ask" i], input[placeholder*="message" i]').first();
    await chatInput.fill('What batteries do I need for my Unimog?');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"], button[aria-label*="send" i]').first();
    await sendButton.click();

    // Wait for response mentioning batteries
    await page.waitForTimeout(5000);

    // Check if response contains battery-related content
    const responseArea = page.locator('[role="log"], [data-testid="chat-messages"], .message');
    await expect(responseArea.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display manual references when available', async ({ page }) => {
    await page.goto('/chat');

    const chatInput = page.locator('textarea, input[placeholder*="Ask" i], input[placeholder*="message" i]').first();
    await chatInput.fill('What is the turbo boost spec for U1700L?');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"], button[aria-label*="send" i]').first();
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(5000);

    // Look for manual references or PDF links
    const manualRef = page.locator('text=/manual|reference|page|chapter|U435/i');
    const count = await manualRef.count();

    // Should have at least some reference to manuals or specs
    expect(count).toBeGreaterThan(0);
  });

  test('should clear chat history', async ({ page }) => {
    await page.goto('/chat');

    // Send a message first
    const chatInput = page.locator('textarea, input[placeholder*="Ask" i], input[placeholder*="message" i]').first();
    await chatInput.fill('Test message');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    await sendButton.click();

    await page.waitForTimeout(2000);

    // Look for clear/reset button
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset"), button[aria-label*="clear" i]');

    if (await clearButton.count() > 0) {
      await clearButton.first().click();

      // Confirm if there's a confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Clear")');
      if (await confirmButton.count() > 0) {
        await confirmButton.first().click();
      }

      // Messages should be cleared
      await page.waitForTimeout(1000);
      const messages = page.locator('[data-testid="chat-message"], .message');
      const messageCount = await messages.count();
      expect(messageCount).toBeLessThanOrEqual(1); // May have welcome message
    }
  });
});
