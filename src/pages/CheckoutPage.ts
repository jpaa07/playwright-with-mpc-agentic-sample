import { expect, type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from './HeaderComponent';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Covers the three checkout steps: information, overview and complete. */
export class CheckoutPage {
  readonly header: HeaderComponent;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInformation(info: CustomerInfo) {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  /** Reads a "$12.34"-style amount out of a summary label. */
  async amount(label: Locator) {
    const text = (await label.textContent()) ?? '';
    const match = text.match(/\$([\d.]+)/);
    if (!match) throw new Error(`No amount found in "${text}"`);
    return Number(match[1]);
  }

  async expectOverview() {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.header.title).toHaveText('Checkout: Overview');
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectComplete() {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
