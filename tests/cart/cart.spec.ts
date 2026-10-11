import { test, expect } from '../../src/fixtures/test';
import { PRODUCTS } from '../../src/data/products';

test.describe('Shopping cart', () => {
  test('adding products updates the cart badge @smoke', async ({ loggedInPage }) => {
    await loggedInPage.addToCart(PRODUCTS.backpack);
    await expect(loggedInPage.header.cartBadge).toHaveText('1');

    await loggedInPage.addToCart(PRODUCTS.bikeLight, PRODUCTS.onesie);
    await expect(loggedInPage.header.cartBadge).toHaveText('3');
  });

  test('cart lists the products that were added', async ({ loggedInPage, cartPage }) => {
    await loggedInPage.addToCart(PRODUCTS.backpack, PRODUCTS.fleeceJacket);
    await loggedInPage.header.openCart();

    await cartPage.expectLoaded();
    await cartPage.expectProducts([PRODUCTS.backpack, PRODUCTS.fleeceJacket]);
  });

  test('removing a product from the cart', async ({ loggedInPage, cartPage }) => {
    await loggedInPage.addToCart(PRODUCTS.backpack, PRODUCTS.bikeLight);
    await loggedInPage.header.openCart();

    await cartPage.remove(PRODUCTS.backpack);

    await cartPage.expectProducts([PRODUCTS.bikeLight]);
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });

  test('cart contents survive a page reload', async ({ loggedInPage, page }) => {
    await loggedInPage.addToCart(PRODUCTS.boltTShirt);
    await page.reload();

    await expect(loggedInPage.header.cartBadge).toHaveText('1');
    await expect(loggedInPage.removeButton(PRODUCTS.boltTShirt)).toBeVisible();
  });
});
