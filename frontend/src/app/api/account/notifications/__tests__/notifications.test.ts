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
  getSessionCookieValue: vi.fn(),
}));

vi.mock("@/lib/medusa", () => ({
  getMedusaStoreHeaders: vi.fn(() => ({ "Content-Type": "application/json" })),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { GET, PATCH } from "../route";
import {
  getAuthTokenFromCookie,
  getMedusaCustomer,
  getSessionCookieValue,
} from "@/lib/auth/server";

const mockGetToken = getAuthTokenFromCookie as ReturnType<typeof vi.fn>;
const mockGetCustomer = getMedusaCustomer as ReturnType<typeof vi.fn>;
const mockGetSession = getSessionCookieValue as ReturnType<typeof vi.fn>;

const SAMPLE_SETTINGS = [
  { id: "orders", email: true, sms: false },
  { id: "promotions", email: false, sms: true },
];

const mockCustomer = {
  id: "cus_123",
  email: "test@example.com",
  first_name: "Иван",
  last_name: "Иванов",
  phone: null,
  metadata: { notification_settings: SAMPLE_SETTINGS },
};

beforeEach(() => {
  mockGetToken.mockReset();
  mockGetCustomer.mockReset();
  mockGetSession.mockReset();
  mockFetch.mockReset();
  mockGetSession.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── GET /api/account/notifications ───────────────────────────────────────────

describe("GET /api/account/notifications", () => {
  it("возвращает 401 без токена", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const res = await GET();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("возвращает settings из customer.metadata", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.settings).toEqual(SAMPLE_SETTINGS);
  });

  it("возвращает settings=null если у customer нет notification_settings", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue({ ...mockCustomer, metadata: {} });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.settings).toBeNull();
  });

  it("возвращает settings=null если metadata отсутствует", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue({ ...mockCustomer, metadata: undefined });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.settings).toBeNull();
  });

  it("возвращает 401 если getMedusaCustomer бросает ошибку", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockRejectedValue(new Error("Medusa unavailable"));

    const res = await GET();
    expect(res.status).toBe(401);
  });
});

// ── PATCH /api/account/notifications ─────────────────────────────────────────

describe("PATCH /api/account/notifications", () => {
  function makeReq(body: unknown) {
    return new Request("http://localhost/api/account/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("возвращает 401 без токена", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const res = await PATCH(makeReq({ settings: SAMPLE_SETTINGS }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("возвращает 400 если settings не массив", async () => {
    mockGetToken.mockResolvedValue("jwt-token");

    const res = await PATCH(makeReq({ settings: "not-array" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/settings/i);
  });

  it("возвращает 400 если settings отсутствует в теле", async () => {
    mockGetToken.mockResolvedValue("jwt-token");

    const res = await PATCH(makeReq({}));
    expect(res.status).toBe(400);
  });

  it("сохраняет настройки и возвращает { ok: true }", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ customer: mockCustomer }),
    });

    const res = await PATCH(makeReq({ settings: SAMPLE_SETTINGS }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it("передаёт settings в Medusa POST /store/customers/me", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ customer: mockCustomer }),
    });

    await PATCH(makeReq({ settings: SAMPLE_SETTINGS }));

    expect(mockFetch).toHaveBeenCalledOnce();
    const [_url, opts] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(opts.body as string) as {
      metadata: { notification_settings: unknown };
    };
    expect(body.metadata.notification_settings).toEqual(SAMPLE_SETTINGS);
  });

  it("возвращает ошибку Medusa с правильным статусом", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: "Validation error" }),
    });

    const res = await PATCH(makeReq({ settings: SAMPLE_SETTINGS }));
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error).toBe("Validation error");
  });

  it("возвращает 500 если fetch бросает исключение", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockRejectedValue(new Error("Network error"));

    const res = await PATCH(makeReq({ settings: SAMPLE_SETTINGS }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("Network error");
  });

  it("работает с пустым массивом settings", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ customer: mockCustomer }),
    });

    const res = await PATCH(makeReq({ settings: [] }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
