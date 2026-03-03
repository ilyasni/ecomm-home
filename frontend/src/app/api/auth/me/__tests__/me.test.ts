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

import { GET } from "../route";
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
};

beforeEach(() => {
  mockGetToken.mockReset();
  mockGetCustomer.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

describe("GET /api/auth/me", () => {
  it("возвращает 401 если нет cookie", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const res = await GET();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error.message).toBe("Unauthorized");
  });

  it("возвращает 200 с user при наличии валидного токена", async () => {
    mockGetToken.mockResolvedValue("jwt-token-123");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.id).toBe("cus_123");
    expect(data.user.email).toBe("test@example.com");
  });

  it("передаёт токен в getMedusaCustomer", async () => {
    mockGetToken.mockResolvedValue("my-jwt");
    mockGetCustomer.mockResolvedValue(mockCustomer);

    await GET();
    expect(mockGetCustomer).toHaveBeenCalledWith("my-jwt");
  });

  it("возвращает 401 если getMedusaCustomer выбрасывает ошибку", async () => {
    mockGetToken.mockResolvedValue("bad-token");
    mockGetCustomer.mockRejectedValue(new Error("Customer not found"));

    const res = await GET();
    expect(res.status).toBe(401);
  });
});
