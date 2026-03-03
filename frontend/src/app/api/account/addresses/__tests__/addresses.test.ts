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
  getMedusaCustomer: vi.fn(),
  getSessionCookieValue: vi.fn().mockResolvedValue(undefined),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { GET, POST } from "../route";
import { getAuthTokenFromCookie, getMedusaCustomer } from "@/lib/auth/server";

const mockGetToken = getAuthTokenFromCookie as ReturnType<typeof vi.fn>;
const mockGetCustomer = getMedusaCustomer as ReturnType<typeof vi.fn>;

const mockAddress = {
  id: "addr_1",
  first_name: "Иван",
  last_name: "Иванов",
  address_1: "ул. Пушкина, д.1",
  city: "Москва",
  country_code: "ru",
  phone: "+79001234567",
};

const mockCustomer = {
  id: "cus_123",
  email: "test@example.com",
  first_name: "Иван",
  last_name: "Иванов",
  phone: null,
  company_name: null,
  addresses: [mockAddress],
};

beforeEach(() => {
  mockGetToken.mockReset();
  mockGetCustomer.mockReset();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── GET /api/account/addresses ────────────────────────────────────────────────

describe("GET /api/account/addresses", () => {
  it("возвращает пустой массив без токена (гость)", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.addresses).toEqual([]);
  });

  it("возвращает адреса из customer при наличии токена", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.addresses).toHaveLength(1);
    expect(data.addresses[0].id).toBe("addr_1");
  });

  it("возвращает пустой массив если getMedusaCustomer выбрасывает ошибку (graceful)", async () => {
    mockGetToken.mockResolvedValue("token");
    mockGetCustomer.mockRejectedValue(new Error("Network error"));

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.addresses).toEqual([]);
  });
});

// ── POST /api/account/addresses ───────────────────────────────────────────────

describe("POST /api/account/addresses", () => {
  it("возвращает 401 без токена", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const req = new Request("http://localhost/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address_1: "ул. Тест, 1", city: "Москва", country_code: "ru" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("возвращает список адресов при успешном добавлении", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ customer: { addresses: [mockAddress] } }),
    });

    const req = new Request("http://localhost/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address_1: "ул. Пушкина, д.1", city: "Москва", country_code: "ru" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.addresses).toHaveLength(1);
  });

  it("проксирует ошибку от Medusa при неудаче", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: "Invalid address" }),
    });

    const req = new Request("http://localhost/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address_1: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
