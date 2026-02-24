import { expect, test } from "@playwright/test";

test.describe("Каталог: переходы и быстрый просмотр", () => {
  test("переход в карточку из листинга работает", async ({ page }) => {
    await page.goto("/catalog/sets");

    const firstCardLink = page.locator("main article h3 a:visible").first();
    await expect(firstCardLink).toBeVisible();
    await firstCardLink.click();

    await expect(page).toHaveURL(/\/catalog\/[^/]+$/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("быстрый просмотр по клику на изображение открывает модалку", async ({ page }) => {
    await page.goto("/catalog/sets");

    const quickViewImageTrigger = page
      .locator('button[aria-label^="Быстрый просмотр:"]:visible')
      .first();
    await expect(quickViewImageTrigger).toBeVisible();
    await quickViewImageTrigger.click();

    const modalLink = page.locator('a:visible', { hasText: "Больше информации о товаре" }).first();
    await expect(modalLink).toBeVisible();
    const href = await modalLink.getAttribute("href");
    expect(href).toMatch(/^\/catalog\/[^/]+$/);
    await page.goto(href ?? "/catalog");

    await expect(page).toHaveURL(/\/catalog\/[^/]+$/);
  });
});
