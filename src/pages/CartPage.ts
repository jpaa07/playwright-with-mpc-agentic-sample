import { expect, type Locator, type Page } from '@playwright/test';
import type { Product } from '../data/products';
import { HeaderComponent } from './HeaderComponent';

export class CartPage {
  readonly header: HeaderComponent;
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.header.title).toHaveText('Your Cart');
  }

  async expectProducts(products: Product[]) {
    await expect(this.items.getByTestId('inventory-item-name')).toHaveText(products.map((p) => p.name));
  }

  async remove(product: Product) {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
