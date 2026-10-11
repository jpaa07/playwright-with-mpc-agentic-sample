// spec: specs/product-details.plan.md
// seed: tests/seed.spec.ts
//
// Sample output of the **generator** agent (`playwright-test-generator`).
// Generated tests live in this folder so they are easy to review before you
// promote them into the hand-written suites (and refactor them onto page objects).

import { test, expect } from '../../src/fixtures/test';

test.describe('Product Details', () => {
  test('Open product details from the inventory', async ({ loggedInPage, page }) => {
    // 1. Click the "Sauce Labs Backpack" product name and wait for the details page ("Back to products" is visible)
    await page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' }).click();
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

    // 2. Verify the URL contains `inventory-item.html`
    await expect(page).toHaveURL(/inventory-item\.html/);

    // 3. Verify the product name is "Sauce Labs Backpack"
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');

    // 4. Verify the price is "$29.99"
    await expect(page.getByTestId('inventory-item-price')).toHaveText('$29.99');
  });

  test('Add to cart from the details page', async ({ loggedInPage, page }) => {
    // 1. Click the "Sauce Labs Bike Light" product name and wait for the details page ("Back to products" is visible)
    await page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Bike Light' }).click();
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

    // 2. Click "Add to cart"
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // 3. Verify the button now says "Remove"
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

    // 4. Verify the cart badge shows "1"
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('Return to the product list', async ({ loggedInPage, page }) => {
    // 1. Click the "Sauce Labs Onesie" product name and wait for the details page ("Back to products" is visible)
    await page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Onesie' }).click();
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

    // 2. Click "Back to products"
    await page.getByRole('button', { name: 'Back to products' }).click();

    // 3. Verify the "Products" title is visible
    await expect(page.getByTestId('title')).toHaveText('Products');
  });
});
