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
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { GET, POST } from "../route";
import { getAuthTokenFromCookie, getMedusaCustomer } from "@/lib/auth/server";

const mockGetToken = getAuthTokenFromCookie as ReturnType<typeof vi.fn>;
const mockGetCustomer = getMedusaCustomer as ReturnType<typeof vi.fn>;

const mockCustomer = {
  id: "cus_123",
  email: "test@example.com",
  first_name: "Иван",
  last_name: "Иванов",
  phone: null,
  company_name: null,
  addresses: [],
  metadata: { bonus_balance: 500 },
};

beforeEach(() => {
  mockGetToken.mockReset();
  mockGetCustomer.mockReset();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── GET /api/account/bonuses ──────────────────────────────────────────────────

describe("GET /api/account/bonuses", () => {
  it("возвращает balance=0 без токена (гость)", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.balance).toBe(0);
  });

  it("возвращает баланс из customer.metadata при наличии токена", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.balance).toBe(500);
  });

  it("возвращает balance=0 если у customer нет metadata.bonus_balance", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue({ ...mockCustomer, metadata: undefined });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.balance).toBe(0);
  });

  it("возвращает balance=0 если metadata.bonus_balance = 0", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue({
      ...mockCustomer,
      metadata: { bonus_balance: 0 },
    });

    const res = await GET();
    const data = await res.json();
    expect(data.balance).toBe(0);
  });

  it("возвращает balance=0 при ошибке getMedusaCustomer (graceful)", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockRejectedValue(new Error("Medusa unavailable"));

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.balance).toBe(0);
  });
});

// ── POST /api/account/bonuses ─────────────────────────────────────────────────
// Примечание: тесты admin-path (реальный запрос к /admin/customers/:id)
// требуют MEDUSA_ADMIN_EMAIL/PASSWORD в env и покрываются e2e-тестами.
// Здесь тестируем: авторизация, валидация, stub-режим (без admin credentials).

describe("POST /api/account/bonuses", () => {
  it("возвращает 401 без токена", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earnedAmount: 100 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("возвращает 400 если earnedAmount = 0", async () => {
    mockGetToken.mockResolvedValue("jwt-token");

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earnedAmount: 0 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("возвращает 400 если earnedAmount отрицательный", async () => {
    mockGetToken.mockResolvedValue("jwt-token");

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earnedAmount: -50 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("возвращает 400 если earnedAmount не передан", async () => {
    mockGetToken.mockResolvedValue("jwt-token");

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("stub-режим: возвращает ok=true и stub=true без admin-credentials", async () => {
    // В test-среде MEDUSA_ADMIN_EMAIL не задан → stub mode
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earnedAmount: 250 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.stub).toBe(true);
    expect(data.balance).toBe(750); // 500 (текущий) + 250
  });

  it("stub-режим: корректно суммирует с нулевым балансом (нет metadata)", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue({ ...mockCustomer, metadata: undefined });

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earnedAmount: 100 }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.balance).toBe(100); // 0 + 100
    expect(data.stub).toBe(true);
  });

  it("округляет earnedAmount до целого числа", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earnedAmount: 99.7 }),
    });
    const res = await POST(req);
    const data = await res.json();
    // Math.round(99.7) = 100 → 500 + 100 = 600
    expect(data.balance).toBe(600);
  });

  it("возвращает 500 если getMedusaCustomer выбрасывает ошибку", async () => {
    mockGetToken.mockResolvedValue("jwt-token");
    mockGetCustomer.mockRejectedValue(new Error("Network error"));

    const req = new Request("http://localhost/api/account/bonuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earnedAmount: 100 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });
});
