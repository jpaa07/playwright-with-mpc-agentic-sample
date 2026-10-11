import { test, expect } from '../../src/fixtures/test';

test.describe('Inventory sorting', () => {
  test('default order is name A to Z', async ({ loggedInPage }) => {
    const names = await loggedInPage.names();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sort by name Z to A', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('za');

    const names = await loggedInPage.names();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sort by price low to high', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('lohi');

    const prices = await loggedInPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('hilo');

    const prices = await loggedInPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
