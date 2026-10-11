import { test, expect } from '../../src/fixtures/test';
import { PRODUCTS, TAX_RATE } from '../../src/data/products';

const customer = { firstName: 'Ada', lastName: 'Lovelace', postalCode: '10001' };

test.describe('Checkout', () => {
  test('complete purchase end to end @smoke', async ({ loggedInPage, cartPage, checkoutPage }) => {
    await loggedInPage.addToCart(PRODUCTS.backpack, PRODUCTS.bikeLight);
    await loggedInPage.header.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation(customer);
    await checkoutPage.expectOverview();
    await checkoutPage.finish();

    await checkoutPage.expectComplete();
    await expect(checkoutPage.header.cartBadge).toBeHidden();
  });

  test('overview shows correct subtotal, tax and total', async ({ loggedInPage, cartPage, checkoutPage }) => {
    const products = [PRODUCTS.backpack, PRODUCTS.fleeceJacket, PRODUCTS.onesie];
    await loggedInPage.addToCart(...products);
    await loggedInPage.header.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer);

    const expectedSubtotal = products.reduce((sum, p) => sum + p.price, 0);
    const expectedTax = Math.round(expectedSubtotal * TAX_RATE * 100) / 100;

    expect(await checkoutPage.amount(checkoutPage.subtotal)).toBeCloseTo(expectedSubtotal, 2);
    expect(await checkoutPage.amount(checkoutPage.tax)).toBeCloseTo(expectedTax, 2);
    expect(await checkoutPage.amount(checkoutPage.total)).toBeCloseTo(expectedSubtotal + expectedTax, 2);
  });

  const missingFields = [
    { field: 'first name', info: { ...customer, firstName: '' }, error: 'First Name is required' },
    { field: 'last name', info: { ...customer, lastName: '' }, error: 'Last Name is required' },
    { field: 'postal code', info: { ...customer, postalCode: '' }, error: 'Postal Code is required' },
  ];

  for (const { field, info, error } of missingFields) {
    test(`information form requires ${field}`, async ({ loggedInPage, cartPage, checkoutPage }) => {
      await loggedInPage.addToCart(PRODUCTS.onesie);
      await loggedInPage.header.openCart();
      await cartPage.checkout();

      await checkoutPage.fillInformation(info);

      await expect(checkoutPage.error).toContainText(error);
    });
  }

  test('cancel on overview returns to inventory and keeps the cart', async ({
    loggedInPage,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInPage.addToCart(PRODUCTS.onesie);
    await loggedInPage.header.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer);

    await checkoutPage.cancelButton.click();

    await loggedInPage.expectLoaded();
    await expect(loggedInPage.header.cartBadge).toHaveText('1');
  });
});
