import { test, expect } from '../../src/fixtures/test';
import { USERS } from '../../src/data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and see the product list @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked out user sees an error', async ({ loginPage, page }) => {
    await loginPage.login(USERS.lockedOut);

    await loginPage.expectError('Sorry, this user has been locked out.');
    await expect(page).toHaveURL(/\/$/);
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, 'not_the_password');

    await loginPage.expectError('Username and password do not match any user in this service');
  });

  const requiredFields = [
    { case: 'empty username', username: '', password: 'secret_sauce', error: 'Username is required' },
    { case: 'empty password', username: USERS.standard, password: '', error: 'Password is required' },
  ];

  for (const { case: name, username, password, error } of requiredFields) {
    test(`validation: ${name}`, async ({ loginPage }) => {
      await loginPage.login(username, password);
      await loginPage.expectError(error);
    });
  }

  test('protected pages redirect anonymous visitors to login', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });

  test('user can log out from the menu', async ({ loggedInPage, loginPage }) => {
    await loggedInPage.header.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });
});
