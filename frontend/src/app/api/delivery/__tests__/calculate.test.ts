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

import { POST } from "../calculate/route";

// ── POST /api/delivery/calculate ──────────────────────────────────────────────

describe("POST /api/delivery/calculate — stub режим", () => {
  it("возвращает price: 390 для Москвы", async () => {
    const req = new Request("http://localhost/api/delivery/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toCity: "msk" }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.price).toBe(390);
  });

  it("возвращает тарифный код 136", async () => {
    const req = new Request("http://localhost/api/delivery/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toCity: "spb" }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.tariffCode).toBe(136);
  });

  it("возвращает корректные сроки доставки", async () => {
    const req = new Request("http://localhost/api/delivery/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toCity: "ekb" }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.periodMin).toBe(3);
    expect(data.periodMax).toBe(5);
  });

  it("принимает weight и возвращает 200", async () => {
    const req = new Request("http://localhost/api/delivery/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toCity: "kzn", weight: 2500 }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.price).toBeDefined();
  });

  it("использует msk по умолчанию при отсутствии toCity", async () => {
    const req = new Request("http://localhost/api/delivery/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.price).toBe(390);
  });

  it("не вызывает fetch в stub-режиме", async () => {
    const req = new Request("http://localhost/api/delivery/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toCity: "nsk" }),
    });
    await POST(req);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("одинаковый результат для всех городов в stub-режиме", async () => {
    const cities = ["msk", "spb", "tvr", "kzn", "nsk", "ekb"];
    const results = await Promise.all(
      cities.map(async (city) => {
        const req = new Request("http://localhost/api/delivery/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toCity: city }),
        });
        return (await POST(req)).json();
      })
    );
    results.forEach((data) => {
      expect(data.price).toBe(390);
      expect(data.tariffCode).toBe(136);
    });
  });
});
