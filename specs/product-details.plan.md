# SauceDemo Product Details – Test Plan

> Sample output of the **planner** agent (`playwright-test-planner`).
> Regenerate it with the prompt in [`prompts/01-plan.md`](../prompts/01-plan.md).

## Application Overview

SauceDemo is a demo e-commerce store. After logging in, users see a catalogue of six
products. Clicking a product name or image opens a details page with the product's
name, description, price, an add/remove cart button and a "Back to products" button.

## Test Scenarios

### 1. Product Details
**Seed:** `tests/seed.spec.ts`

#### 1.1 Open product details from the inventory
**Steps:**
1. Click the "Sauce Labs Backpack" product name and wait for the details page ("Back to products" is visible)
2. Verify the URL contains `inventory-item.html`
3. Verify the product name is "Sauce Labs Backpack"
4. Verify the price is "$29.99"

**Expected:** The details page shows the selected product's information.

#### 1.2 Add to cart from the details page
**Steps:**
1. Click the "Sauce Labs Bike Light" product name and wait for the details page ("Back to products" is visible)
2. Click "Add to cart"
3. Verify the button now says "Remove"
4. Verify the cart badge shows "1"

**Expected:** The product is in the cart and the badge reflects it.

#### 1.3 Return to the product list
**Steps:**
1. Click the "Sauce Labs Onesie" product name and wait for the details page ("Back to products" is visible)
2. Click "Back to products"
3. Verify the "Products" title is visible

**Expected:** The user is back on the inventory page.
