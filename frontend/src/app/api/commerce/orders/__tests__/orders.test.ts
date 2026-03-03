import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Мокаем next/server до импорта роута
vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status ?? 200,
    }),
  },
}));

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

import { POST } from "../route";

// ── POST /api/commerce/orders ─────────────────────────────────────────────────

describe("POST /api/commerce/orders", () => {
  const validBody = {
    customerName: "Иван Иванов",
    email: "ivan@test.com",
    phone: "+79001234567",
    deliveryAddress: "г. Москва, ул. Ленина, 1",
    paymentMethod: "card",
    deliveryMethod: "courier",
    items: [{ title: "Комплект постельного белья", quantity: 1, price: "15 000 ₽" }],
  };

  it("возвращает { id: null } без admin credentials (test env)", async () => {
    const req = new Request("http://localhost/api/commerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.id).toBeNull();
  });

  it("не вызывает fetch при отсутствии admin credentials", async () => {
    const req = new Request("http://localhost/api/commerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    await POST(req);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("возвращает status 400 при невалидном JSON", async () => {
    const req = new Request("http://localhost/api/commerce/orders", {
      method: "POST",
      body: "not valid json{{{",
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.id).toBeNull();
  });

  it("логирует предупреждение при отсутствии credentials", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const req = new Request("http://localhost/api/commerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    await POST(req);
    // console.warn вызывается с одной строкой вида:
    // "[/api/commerce/orders] Medusa admin credentials not configured"
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("credentials"));
  });
});

// ── parseRubToKopecks (через поведение роута) ─────────────────────────────────

describe("parseRubToKopecks через роут с мокнутым Medusa", () => {
  it("корректно парсит цену '15 000 ₽' в копейки при наличии credentials", async () => {
    // Устанавливаем env до сброса кэша модулей
    vi.stubEnv("MEDUSA_ADMIN_EMAIL", "admin@test.com");
    vi.stubEnv("MEDUSA_ADMIN_PASSWORD", "password");

    // Сбрасываем кэш модулей — следующий import() получит свежую копию
    // с уже обновлёнными process.env (ADMIN_EMAIL/PASSWORD — module-level const)
    vi.resetModules();

    // Auth токен
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: "test-token-123" }),
    });
    // Regions
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          regions: [{ id: "reg_rub", currency_code: "rub" }],
        }),
    });
    // Draft order
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          draft_order: { id: "dorder_test_001" },
        }),
    });

    const req = new Request("http://localhost/api/commerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Иван Иванов",
        email: "ivan@test.com",
        phone: "+79001234567",
        deliveryAddress: "г. Москва, ул. Ленина, 1",
        paymentMethod: "card",
        deliveryMethod: "courier",
        items: [{ title: "Товар", quantity: 1, price: "15 000 ₽" }],
      }),
    });

    // Импортируем роут заново после vi.resetModules() + vi.stubEnv()
    const { POST: postFn } = await import("../route");
    const response = await postFn(req);
    const data = await response.json();

    // Draft order должен быть вызван с unit_price = 1500000 (15 000 ₽ × 100)
    const draftOrderCall = mockFetch.mock.calls.find(([url]) =>
      (url as string).includes("draft-orders")
    );
    if (draftOrderCall) {
      const body = JSON.parse(draftOrderCall[1].body as string);
      expect(body.items[0].unit_price).toBe(1500000);
    }

    expect(data.id).toBe("dorder_test_001");
  });
});
