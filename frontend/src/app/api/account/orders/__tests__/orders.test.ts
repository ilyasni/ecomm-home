import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status ?? 200,
    }),
  },
}));

vi.mock("@/lib/auth/server", () => ({
  getAuthTokenFromCookie: vi.fn(),
  getSessionCookieValue: vi.fn().mockResolvedValue(undefined),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { GET } from "../route";
import { getAuthTokenFromCookie } from "@/lib/auth/server";

const mockGetToken = getAuthTokenFromCookie as ReturnType<typeof vi.fn>;

const mockOrder = {
  id: "order_123",
  display_id: 1,
  status: "completed",
  created_at: "2026-01-01T00:00:00Z",
  total: 15000,
  items: [
    {
      id: "item_1",
      title: "Полотенце",
      quantity: 2,
      unit_price: 5000,
      thumbnail: "/img.jpg",
    },
  ],
  shipping_address: { address_1: "ул. Пушкина, д.1", city: "Москва" },
};

beforeEach(() => {
  mockGetToken.mockReset();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── GET /api/account/orders ───────────────────────────────────────────────────

describe("GET /api/account/orders", () => {
  it("возвращает пустой массив без токена (гость)", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orders).toEqual([]);
  });

  it("возвращает список заказов при наличии токена", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orders: [mockOrder] }),
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orders).toHaveLength(1);
    expect(data.orders[0].id).toBe("order_123");
  });

  it("возвращает пустой массив если Medusa недоступна (graceful)", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockRejectedValue(new Error("Network error"));

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orders).toEqual([]);
  });

  it("возвращает пустой массив при 4xx от Medusa (graceful)", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orders).toEqual([]);
  });

  it("передаёт Bearer токен в заголовок запроса к Medusa", async () => {
    mockGetToken.mockResolvedValue("my-secret-jwt");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orders: [] }),
    });

    await GET();
    expect(mockFetch).toHaveBeenCalledOnce();
    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer my-secret-jwt"
    );
  });
});
