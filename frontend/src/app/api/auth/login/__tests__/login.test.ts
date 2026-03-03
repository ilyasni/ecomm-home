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
  SESSION_COOKIE_NAME: "vb_session",
  loginWithMedusa: vi.fn(),
  getMedusaCustomer: vi.fn(),
  exchangeJwtForSession: vi.fn().mockResolvedValue(undefined),
  transferCartToCustomer: vi.fn().mockResolvedValue(undefined),
}));

// Mock next/headers cookies (for cart transfer check)
const mockCookiesGet = vi.fn().mockReturnValue(undefined);
vi.mock("next/headers", () => ({
  cookies: () => Promise.resolve({ get: mockCookiesGet }),
}));

import { POST } from "../route";
import { loginWithMedusa, getMedusaCustomer } from "@/lib/auth/server";

const mockLogin = loginWithMedusa as ReturnType<typeof vi.fn>;
const mockGetCustomer = getMedusaCustomer as ReturnType<typeof vi.fn>;

const mockCustomer = {
  id: "cus_123",
  email: "test@example.com",
  first_name: "Иван",
  last_name: "Иванов",
  phone: null,
  company_name: null,
  addresses: [],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  mockLogin.mockReset();
  mockGetCustomer.mockReset();
  mockCookiesGet.mockReturnValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  it("возвращает 400 при отсутствии identifier", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "secret" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("возвращает 400 при отсутствии password", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "test@example.com" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("возвращает 401 при ошибке аутентификации Medusa", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "test@example.com", password: "wrong" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error.message).toContain("Invalid credentials");
  });

  it("возвращает 200 с user при успешном логине", async () => {
    mockLogin.mockResolvedValue("jwt-token-123");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "test@example.com", password: "secret" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.id).toBe("cus_123");
    expect(data.user.email).toBe("test@example.com");
  });

  it("вызывает loginWithMedusa с правильными аргументами", async () => {
    mockLogin.mockResolvedValue("token");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "user@test.com", password: "pass123" }),
    });
    await POST(req);
    expect(mockLogin).toHaveBeenCalledWith("user@test.com", "pass123");
  });

  it("возвращает 401 при ошибке getMedusaCustomer", async () => {
    mockLogin.mockResolvedValue("token");
    mockGetCustomer.mockRejectedValue(new Error("Customer not found"));

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "test@example.com", password: "secret" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
