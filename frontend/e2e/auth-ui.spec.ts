import { expect, test } from "@playwright/test";

test.describe("Auth UI сценарии", () => {
  test("профиль открывает модалку входа и валидирует пустую форму", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Профиль" }).first().click();
    await expect(page.getByRole("heading", { name: "Войти по почте" })).toBeVisible();

    await page.getByRole("button", { name: "Войти в кабинет" }).click();
    await expect(page.getByText("Введите e-mail")).toBeVisible();
    await expect(page.getByText("Введите пароль")).toBeVisible();
  });

  test("переключение на регистрацию работает", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Профиль" }).first().click();
    await page.getByRole("button", { name: "Регистрация на сайте" }).click();

    await expect(
      page.getByRole("heading", { name: "Зарегистрируйтесь на сайте" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Создать учетную запись в кабинете" })).toBeDisabled();
  });
});
