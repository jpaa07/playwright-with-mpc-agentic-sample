# Framework guide

## Layers

1. **Data** (`src/data/`): users, products, tax rate. No Playwright code.
2. **Page objects** (`src/pages/`): one class per page, exposing `Locator`s and user-level actions
   (`login()`, `addToCart()`, `fillInformation()`). `HeaderComponent` is shared by all pages after login.
3. **Fixtures** (`src/fixtures/test.ts`): extends Playwright's `test` so page objects are injected:
   ```ts
   test('example', async ({ loggedInPage, cartPage }) => { ... });
   ```
   `loggedInPage` logs in as `standard_user` and returns the `InventoryPage`.
4. **Specs** (`tests/`): read like user stories and contain the assertions.

## Locator strategy
SauceDemo exposes `data-test` attributes, so `playwright.config.ts` sets
`testIdAttribute: 'data-test'`. Use `page.getByTestId('checkout')` first, then `getByRole`.
Avoid CSS classes and XPath; they break on restyling and agents generate them poorly.

## Writing a new test by hand
```ts
import { test, expect } from '../../src/fixtures/test';
import { PRODUCTS } from '../../src/data/products';

test('removing the last item clears the badge', async ({ loggedInPage }) => {
  await loggedInPage.addToCart(PRODUCTS.onesie);
  await loggedInPage.removeButton(PRODUCTS.onesie).click();

  await expect(loggedInPage.header.cartBadge).toBeHidden();
});
```

## Adding a page object
1. Create `src/pages/MyPage.ts` with a constructor taking `page` and readonly locators.
2. Register it in `src/fixtures/test.ts` (`myPage: async ({ page }, use) => use(new MyPage(page))`).
3. Mention it in `CLAUDE.md` so agents use it.

## Configuration highlights (`playwright.config.ts`)
- `baseURL` from `BASE_URL`, so tests use relative paths (`page.goto('/cart.html')`).
- Traces on first retry, screenshots and video on failure.
- `retries: 2` and `forbidOnly` only on CI.
- Projects: chromium, firefox, webkit.

## Debugging
```bash
npx playwright test tests/cart --project=chromium --debug   # step through with the inspector
npx playwright test --ui                                     # UI mode
npx playwright show-trace test-results/**/trace.zip          # inspect a CI failure
```
