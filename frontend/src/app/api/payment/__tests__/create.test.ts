import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

import { POST } from "../create/route";

// ── POST /api/payment/create ──────────────────────────────────────────────────

describe("POST /api/payment/create — stub режим", () => {
  it("возвращает paymentId начинающийся с pay_stub_", async () => {
    const req = new Request("http://localhost/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "dorder_test_001",
        amount: 1500000,
        method: "card",
        customerEmail: "ivan@test.com",
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.paymentId).toMatch(/^pay_stub_\d+$/);
  });

  it("возвращает confirmationUrl: 'stub' в stub-режиме", async () => {
    const req = new Request("http://localhost/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "dorder_test_001",
        amount: 600000,
        method: "sbp",
        customerEmail: "test@test.com",
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.confirmationUrl).toBe("stub");
  });

  it("возвращает status: pending", async () => {
    const req = new Request("http://localhost/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "order-123",
        amount: 100000,
        method: "yandex-pay",
        customerEmail: "user@test.com",
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.status).toBe("pending");
  });

  it("не вызывает fetch к YooKassa в stub-режиме", async () => {
    const req = new Request("http://localhost/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: "test", amount: 50000, method: "card" }),
    });
    await POST(req);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("обрабатывает запрос без customerEmail", async () => {
    const req = new Request("http://localhost/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: "order-no-email", amount: 200000, method: "card" }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.paymentId).toBeDefined();
    expect(response.status).toBe(200);
  });

  it("каждый вызов генерирует уникальный paymentId", async () => {
    const makeReq = () =>
      new Request("http://localhost/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: "same-order", amount: 100, method: "card" }),
      });

    const r1 = await (await POST(makeReq())).json();
    await new Promise((r) => setTimeout(r, 2));
    const r2 = await (await POST(makeReq())).json();

    expect(r1.paymentId).not.toBe(r2.paymentId);
  });
});
