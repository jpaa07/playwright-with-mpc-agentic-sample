import { test, expect } from '../src/fixtures/test';

/**
 * Seed test for the Playwright Test Agents (planner / generator / healer).
 *
 * The agents run this test first to put the browser in a known state,
 * then explore or generate from there. Here that state is "standard_user
 * is logged in and looking at the product list".
 */
test.describe('Seed', () => {
  test('seed', async ({ loggedInPage }) => {
    await expect(loggedInPage.items.first()).toBeVisible();
  });
});
