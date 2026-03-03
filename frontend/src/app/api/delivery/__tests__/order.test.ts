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

import { POST } from "../order/route";

// ── POST /api/delivery/order ──────────────────────────────────────────────────

describe("POST /api/delivery/order — stub режим", () => {
  it("возвращает cdekUuid начинающийся с cdek_stub_", async () => {
    const req = new Request("http://localhost/api/delivery/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "order-001",
        toAddress: "ул. Ленина, д. 1",
        toCityId: "msk",
        customerName: "Иван Иванов",
        phone: "+79001234567",
        items: [{ title: "Комплект постельного белья", quantity: 1 }],
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.cdekUuid).toMatch(/^cdek_stub_\d+$/);
  });

  it("возвращает status: accepted", async () => {
    const req = new Request("http://localhost/api/delivery/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "order-002",
        toAddress: "пр. Невский, 114",
        toCityId: "spb",
        customerName: "Анна Петрова",
        phone: "+79009876543",
        items: [{ title: "Подушка", quantity: 2 }],
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.status).toBe("accepted");
    expect(response.status).toBe(200);
  });

  it("не вызывает fetch в stub-режиме", async () => {
    const req = new Request("http://localhost/api/delivery/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "order-003",
        toAddress: "ул. Пушкина, 5",
        toCityId: "tvr",
        customerName: "Пётр Сидоров",
        phone: "+79007654321",
        items: [],
      }),
    });
    await POST(req);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("принимает запрос с пустыми items", async () => {
    const req = new Request("http://localhost/api/delivery/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "order-004",
        toAddress: "ул. Тест, 1",
        toCityId: "ekb",
        customerName: "Тест Тестов",
        phone: "+79001111111",
        items: [],
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.cdekUuid).toBeDefined();
    expect(response.status).toBe(200);
  });

  it("каждый вызов генерирует уникальный cdekUuid", async () => {
    const makeReq = () =>
      new Request("http://localhost/api/delivery/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: "same-order",
          toAddress: "ул. Дубликат, 1",
          toCityId: "msk",
          customerName: "Тест",
          phone: "+79000000000",
          items: [],
        }),
      });

    const r1 = await (await POST(makeReq())).json();
    await new Promise((r) => setTimeout(r, 2));
    const r2 = await (await POST(makeReq())).json();

    expect(r1.cdekUuid).not.toBe(r2.cdekUuid);
  });

  it("использует msk по умолчанию при отсутствии toCityId", async () => {
    const req = new Request("http://localhost/api/delivery/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "order-005",
        toAddress: "ул. Без города, 1",
        customerName: "Без города",
        phone: "+79002222222",
        items: [],
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(data.cdekUuid).toMatch(/^cdek_stub_\d+$/);
  });
});
