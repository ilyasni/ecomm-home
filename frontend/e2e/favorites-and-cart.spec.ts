import { expect, test } from "@playwright/test";

test.describe("Избранное и корзина", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("добавление в избранное и удаление из избранного", async ({ page }) => {
    await page.goto("/catalog/sets");

    await page
      .locator('button[aria-label="Добавить в избранное"]:visible')
      .first()
      .click();
    await page.goto("/favorites");

    const favoritesHeading = page.getByRole("heading", { name: /Избранное/ });
    await expect(favoritesHeading).toBeVisible();
    await expect(favoritesHeading).toContainText("(1)");

    await page
      .locator('button[aria-label="Добавить в избранное"]:visible')
      .first()
      .click();
    await expect(
      page.getByText("Вы ещё не добавили ни одного товара в избранное.")
    ).toBeVisible();
  });

  test("добавление в корзину и оформление заказа", async ({ page }) => {
    await page.goto("/catalog/sets");
    await page
      .locator('button[aria-label="Добавить в корзину"]:visible')
      .first()
      .click();

    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /Корзина/ })).toBeVisible();
    await expect(page.getByText(/\(1 товар\)|\(1 товара\)|\(1 товаров\)/)).toBeVisible();

    await page.getByRole("link", { name: "Оформить заказ" }).first().click();
    await expect(page).toHaveURL(/\/checkout$/);

    await page.getByPlaceholder("Улица, дом, квартира").fill("Москва, ул. Тестовая, д. 1");
    await page.getByRole("button", { name: "Оформить заказ" }).first().click();

    await expect(page).toHaveURL(/\/checkout\/success\?orderId=/);
    await expect(page.getByRole("heading", { name: "Спасибо за заказ!" })).toBeVisible();
  });
});
