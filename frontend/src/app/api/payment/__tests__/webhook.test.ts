import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status ?? 200,
    }),
  },
}));

import { POST } from "../webhook/route";

// ── POST /api/payment/webhook ─────────────────────────────────────────────────

function makeWebhookReq(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/payment/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/payment/webhook — stub режим", () => {
  it("возвращает { received: true } для payment.succeeded", async () => {
    const response = await POST(
      makeWebhookReq({
        type: "notification",
        event: "payment.succeeded",
        object: {
          id: "pay_123",
          status: "succeeded",
          amount: { value: "1500.00", currency: "RUB" },
          metadata: { orderId: "order-001" },
        },
      })
    );
    const data = await response.json();
    expect(data.received).toBe(true);
    expect(response.status).toBe(200);
  });

  it("возвращает { received: true } для payment.canceled", async () => {
    const response = await POST(
      makeWebhookReq({ event: "payment.canceled", object: { id: "pay_456", status: "canceled" } })
    );
    const data = await response.json();
    expect(data.received).toBe(true);
  });

  it("возвращает { received: true } для refund.succeeded", async () => {
    const response = await POST(
      makeWebhookReq({
        event: "refund.succeeded",
        object: { id: "refund_789", status: "succeeded" },
      })
    );
    const data = await response.json();
    expect(data.received).toBe(true);
  });

  it("возвращает { received: true } для неизвестного события", async () => {
    const response = await POST(
      makeWebhookReq({ event: "payment.waiting_for_capture", object: { id: "pay_unknown" } })
    );
    const data = await response.json();
    expect(data.received).toBe(true);
  });

  it("возвращает 400 при некорректном JSON", async () => {
    const req = new Request("http://localhost/api/payment/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{{{",
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it("обрабатывает body без event (graceful)", async () => {
    const response = await POST(makeWebhookReq({}));
    const data = await response.json();
    expect(data.received).toBe(true);
  });
});

// ── POST /api/payment/webhook — production-like режим (YOOKASSA_SHOP_ID задан) ─

describe("POST /api/payment/webhook — production режим", () => {
  beforeEach(() => {
    process.env.YOOKASSA_SHOP_ID = "real_shop_123";
  });

  afterEach(() => {
    delete process.env.YOOKASSA_SHOP_ID;
  });

  it("возвращает 403 при неизвестном IP в production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await POST(
      makeWebhookReq(
        { event: "payment.succeeded", object: { id: "pay_1" } },
        { "x-forwarded-for": "1.2.3.4" } // не из allowlist
      )
    );
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Forbidden");

    vi.unstubAllEnvs();
  });

  it("принимает запрос без IP-проверки в non-production env", async () => {
    // NODE_ENV=test → ipAllowed=true (process.env.NODE_ENV !== "production")
    const response = await POST(
      makeWebhookReq(
        {
          event: "payment.succeeded",
          object: { id: "pay_2", metadata: { orderId: "ord_medusa" } },
        },
        { "x-forwarded-for": "1.2.3.4" }
      )
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.received).toBe(true);
  });

  it("возвращает { received: true } для local-* orderId без fetch к Medusa", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const response = await POST(
      makeWebhookReq({
        event: "payment.succeeded",
        object: { id: "pay_3", status: "succeeded", metadata: { orderId: "local-1700000000000" } },
      })
    );
    const data = await response.json();
    expect(data.received).toBe(true);
    // local-* заказ → Medusa API не вызывается
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("возвращает { received: true } если orderId отсутствует (без metadata)", async () => {
    const response = await POST(
      makeWebhookReq({
        event: "payment.succeeded",
        object: { id: "pay_4", status: "succeeded" },
      })
    );
    const data = await response.json();
    expect(data.received).toBe(true);
  });

  it("без admin-credentials не делает запрос к Medusa при payment.succeeded", async () => {
    // MEDUSA_ADMIN_EMAIL/PASSWORD не заданы в тест-среде
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const response = await POST(
      makeWebhookReq({
        event: "payment.succeeded",
        object: { id: "pay_5", status: "succeeded", metadata: { orderId: "ord_medusa_123" } },
      })
    );
    expect(response.status).toBe(200);
    // Нет admin creds → updateMedusaOrderMetadata не вызывается
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
