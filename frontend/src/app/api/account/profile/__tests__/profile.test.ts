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

// Mock global fetch for PATCH
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { GET, PATCH } from "../route";
import { getAuthTokenFromCookie, getMedusaCustomer } from "@/lib/auth/server";

const mockGetToken = getAuthTokenFromCookie as ReturnType<typeof vi.fn>;
const mockGetCustomer = getMedusaCustomer as ReturnType<typeof vi.fn>;

const mockCustomer = {
  id: "cus_123",
  email: "test@example.com",
  first_name: "Иван",
  last_name: "Иванов",
  phone: "+79001234567",
  company_name: null,
  addresses: [],
};

beforeEach(() => {
  mockGetToken.mockReset();
  mockGetCustomer.mockReset();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── GET /api/account/profile ──────────────────────────────────────────────────

describe("GET /api/account/profile", () => {
  it("возвращает 401 без токена", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("возвращает 200 с данными customer при наличии токена", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.id).toBe("cus_123");
    expect(data.user.email).toBe("test@example.com");
  });

  it("возвращает 401 если getMedusaCustomer выбрасывает ошибку", async () => {
    mockGetToken.mockResolvedValue("token");
    mockGetCustomer.mockRejectedValue(new Error("Unauthorized"));

    const res = await GET();
    expect(res.status).toBe(401);
  });
});

// ── PATCH /api/account/profile ────────────────────────────────────────────────

describe("PATCH /api/account/profile", () => {
  it("возвращает 401 без токена", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const req = new Request("http://localhost/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: "Новое" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it("возвращает обновлённый customer при успехе", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    const updated = { ...mockCustomer, first_name: "Новое" };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ customer: updated }),
    });

    const req = new Request("http://localhost/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: "Новое" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.first_name).toBe("Новое");
  });

  it("проксирует ошибку от Medusa (4xx)", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: "Validation failed" }),
    });

    const req = new Request("http://localhost/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: "" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(422);
  });
});
