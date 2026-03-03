import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status ?? 200,
    }),
  },
}));

// Mock next/headers cookies
const mockCookiesGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: mockCookiesGet,
    }),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { PUT } from "../route";

beforeEach(() => {
  mockCookiesGet.mockReset();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── PUT /api/cart/address ─────────────────────────────────────────────────────

describe("PUT /api/cart/address", () => {
  it("возвращает 400 если нет cart cookie", async () => {
    mockCookiesGet.mockReturnValue(undefined);

    const req = new Request("http://localhost/api/cart/address", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("No cart");
  });

  it("возвращает 400 если нет email в теле запроса", async () => {
    mockCookiesGet.mockImplementation((name: string) =>
      name === "medusa_cart_id" ? { value: "cart_123" } : undefined
    );

    const req = new Request("http://localhost/api/cart/address", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: "Иван" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("email required");
  });

  it("возвращает cart при успешном обновлении адреса", async () => {
    mockCookiesGet.mockImplementation((name: string) =>
      name === "medusa_cart_id" ? { value: "cart_123" } : undefined
    );
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cart: { id: "cart_123", email: "test@example.com" } }),
    });

    const req = new Request("http://localhost/api/cart/address", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        first_name: "Иван",
        last_name: "Иванов",
        address_1: "ул. Пушкина, д.1",
        city: "Москва",
        country_code: "ru",
      }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.cart.id).toBe("cart_123");
  });

  it("возвращает 502 если Medusa вернула ошибку", async () => {
    mockCookiesGet.mockImplementation((name: string) =>
      name === "medusa_cart_id" ? { value: "cart_123" } : undefined
    );
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Bad request"),
    });

    const req = new Request("http://localhost/api/cart/address", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(502);
  });

  it("возвращает 500 при сетевой ошибке", async () => {
    mockCookiesGet.mockImplementation((name: string) =>
      name === "medusa_cart_id" ? { value: "cart_123" } : undefined
    );
    mockFetch.mockRejectedValue(new Error("Network error"));

    const req = new Request("http://localhost/api/cart/address", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(500);
  });
});
