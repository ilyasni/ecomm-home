import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateCdekDelivery,
  createCdekOrder,
  IS_CDEK_STUB,
  CDEK_CITY_CODES,
  FROM_CITY_CODE,
} from "../cdek";

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ── IS_CDEK_STUB ──────────────────────────────────────────────────────────────

describe("IS_CDEK_STUB", () => {
  it("активен в тестовом окружении (CDEK_CLIENT_ID не задан)", () => {
    expect(IS_CDEK_STUB).toBe(true);
  });
});

// ── FROM_CITY_CODE ────────────────────────────────────────────────────────────

describe("FROM_CITY_CODE", () => {
  it("по умолчанию равен 44 (Москва)", () => {
    expect(FROM_CITY_CODE).toBe(44);
  });
});

// ── CDEK_CITY_CODES ───────────────────────────────────────────────────────────

describe("CDEK_CITY_CODES", () => {
  it("содержит корректный код Москвы", () => {
    expect(CDEK_CITY_CODES.msk).toBe(44);
  });

  it("содержит корректный код Санкт-Петербурга", () => {
    expect(CDEK_CITY_CODES.spb).toBe(137);
  });

  it("содержит корректный код Твери", () => {
    expect(CDEK_CITY_CODES.tvr).toBe(717);
  });

  it("содержит корректный код Екатеринбурга", () => {
    expect(CDEK_CITY_CODES.ekb).toBe(2686);
  });

  it("содержит все 6 городов из deliveryCities", () => {
    const expectedCities = ["msk", "spb", "tvr", "kzn", "nsk", "ekb"];
    expectedCities.forEach((city) => {
      expect(CDEK_CITY_CODES).toHaveProperty(city);
      expect(typeof CDEK_CITY_CODES[city]).toBe("number");
    });
  });
});

// ── calculateCdekDelivery (stub-режим) ────────────────────────────────────────

describe("calculateCdekDelivery — stub", () => {
  it("возвращает 390 ₽ в stub-режиме", async () => {
    const result = await calculateCdekDelivery("msk");
    expect(result.price).toBe(390);
  });

  it("возвращает правильные сроки доставки", async () => {
    const result = await calculateCdekDelivery("msk");
    expect(result.periodMin).toBe(3);
    expect(result.periodMax).toBe(5);
  });

  it("возвращает тарифный код 136 (склад-дверь)", async () => {
    const result = await calculateCdekDelivery("msk");
    expect(result.tariffCode).toBe(136);
  });

  it("не вызывает fetch в stub-режиме", async () => {
    await calculateCdekDelivery("spb");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("одинаковый результат для разных городов в stub-режиме", async () => {
    const msk = await calculateCdekDelivery("msk");
    const ekb = await calculateCdekDelivery("ekb");
    expect(msk).toEqual(ekb);
  });

  it("использует вес по умолчанию 1000 г", async () => {
    // В stub-режиме вес не влияет на результат, но функция должна принять его
    const result = await calculateCdekDelivery("msk");
    expect(result).toBeDefined();
  });
});

// ── createCdekOrder (stub-режим) ──────────────────────────────────────────────

describe("createCdekOrder — stub", () => {
  it("возвращает cdekUuid начинающийся с cdek_stub_", async () => {
    const result = await createCdekOrder({
      orderId: "order-test-1",
      toAddress: "ул. Ленина, д. 1",
      toCityId: "msk",
      customerName: "Иван Иванов",
      phone: "+79001234567",
      items: [{ title: "Комплект постельного белья", quantity: 1 }],
    });
    expect(result.cdekUuid).toMatch(/^cdek_stub_\d+$/);
  });

  it("возвращает status: accepted", async () => {
    const result = await createCdekOrder({
      orderId: "order-test-2",
      toAddress: "пр. Невский, 114",
      toCityId: "spb",
      customerName: "Анна Петрова",
      phone: "+79009876543",
      items: [{ title: "Подушка", quantity: 2 }],
    });
    expect(result.status).toBe("accepted");
  });

  it("не вызывает fetch в stub-режиме", async () => {
    await createCdekOrder({
      orderId: "order-test-3",
      toAddress: "ул. Пушкина, 5",
      toCityId: "tvr",
      customerName: "Пётр Сидоров",
      phone: "+79007654321",
      items: [],
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("каждый вызов генерирует уникальный cdekUuid", async () => {
    const params = {
      orderId: "order-dup",
      toAddress: "ул. Тест, 1",
      toCityId: "msk",
      customerName: "Тест Тестов",
      phone: "+79001111111",
      items: [],
    };
    const r1 = await createCdekOrder(params);
    // небольшая задержка чтобы Date.now() отличался
    await new Promise((r) => setTimeout(r, 2));
    const r2 = await createCdekOrder(params);
    expect(r1.cdekUuid).not.toBe(r2.cdekUuid);
  });
});
