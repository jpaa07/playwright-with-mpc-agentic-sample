import { expect, type Locator, type Page } from '@playwright/test';
import type { Product } from '../data/products';
import { HeaderComponent } from './HeaderComponent';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly header: HeaderComponent;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.header.title).toHaveText('Products');
  }

  addToCartButton(product: Product) {
    return this.page.getByTestId(`add-to-cart-${product.slug}`);
  }

  removeButton(product: Product) {
    return this.page.getByTestId(`remove-${product.slug}`);
  }

  async addToCart(...products: Product[]) {
    for (const product of products) {
      await this.addToCartButton(product).click();
      await expect(this.removeButton(product)).toBeVisible();
    }
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption(option);
  }

  async names() {
    return this.itemNames.allTextContents();
  }

  async prices() {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }
}
