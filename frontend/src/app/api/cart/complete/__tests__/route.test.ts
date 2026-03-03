import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status ?? 200,
      cookies: { set: vi.fn() },
    }),
  },
}));

vi.mock("@/lib/auth/server", () => ({
  AUTH_COOKIE_NAME: "vb_auth_token",
  getSessionCookieValue: vi.fn().mockResolvedValue(undefined),
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

import { POST } from "../route";

beforeEach(() => {
  mockCookiesGet.mockReset();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── POST /api/cart/complete ───────────────────────────────────────────────────

describe("POST /api/cart/complete", () => {
  it("возвращает 400 если нет cart cookie", async () => {
    mockCookiesGet.mockReturnValue(undefined);

    const res = await POST();
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.type).toBe("cart");
    expect(data.error).toBe("No cart found");
  });

  it("возвращает type=order при успешном завершении корзины", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "medusa_cart_id") return { value: "cart_123" };
      return undefined;
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          type: "order",
          order: { id: "order_123", display_id: 1 },
        }),
    });

    const res = await POST();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.type).toBe("order");
    expect(data.order.id).toBe("order_123");
  });

  it("возвращает type=cart когда Medusa вернула cart (нет providers)", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "medusa_cart_id") return { value: "cart_123" };
      return undefined;
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          type: "cart",
          error: "No shipping option selected",
        }),
    });

    const res = await POST();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.type).toBe("cart");
  });

  it("возвращает 502 если Medusa вернула ошибку (не ok)", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "medusa_cart_id") return { value: "cart_123" };
      return undefined;
    });
    mockFetch.mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve("Unprocessable Entity"),
    });

    const res = await POST();
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.type).toBe("cart");
  });

  it("возвращает 500 при сетевой ошибке", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "medusa_cart_id") return { value: "cart_123" };
      return undefined;
    });
    mockFetch.mockRejectedValue(new Error("Network error"));

    const res = await POST();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.type).toBe("cart");
  });

  it("передаёт auth токен как Bearer если customer залогинен", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "medusa_cart_id") return { value: "cart_123" };
      if (name === "vb_auth_token") return { value: "jwt-customer-token" };
      return undefined;
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ type: "order", order: { id: "order_1" } }),
    });

    await POST();
    expect(mockFetch).toHaveBeenCalledOnce();
    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer jwt-customer-token"
    );
  });

  it("не передаёт auth токен для анонимного пользователя", async () => {
    mockCookiesGet.mockImplementation((name: string) => {
      if (name === "medusa_cart_id") return { value: "cart_123" };
      return undefined;
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ type: "order", order: { id: "order_1" } }),
    });

    await POST();
    expect(mockFetch).toHaveBeenCalledOnce();
    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)["Authorization"]).toBeUndefined();
  });
});
