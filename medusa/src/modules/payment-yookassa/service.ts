import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import type {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  WebhookActionResult,
  ProviderWebhookPayload,
} from "@medusajs/framework/types";

type Options = {
  shopId: string;
  secretKey: string;
};

const YOOKASSA_API = "https://api.yookassa.ru/v3";

/**
 * YooKassa payment provider for Medusa v2.
 *
 * Stub implementation — works without real credentials.
 * Replace STUB_* constants and uncomment real API calls
 * when YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY are configured.
 */
export class YookassaPaymentService extends AbstractPaymentProvider<Options> {
  static identifier = "yookassa";

  protected options: Options;

  constructor(container: Record<string, never>, options: Options) {
    super(container, options);
    this.options = options;
  }

  private get isStub(): boolean {
    return (
      !this.options.shopId ||
      this.options.shopId === "test_shop" ||
      !this.options.secretKey ||
      this.options.secretKey === "test_secret_key"
    );
  }

  private basicAuth(): string {
    return Buffer.from(`${this.options.shopId}:${this.options.secretKey}`).toString("base64");
  }

  // ── initiatePayment ──────────────────────────────────────────────────────────
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    if (this.isStub) {
      const stubId = `pay_stub_${Date.now()}`;
      return {
        id: stubId,
        data: {
          id: stubId,
          confirmationUrl: "https://yookassa.ru/checkout/payments/stub",
          status: "pending",
        },
      };
    }

    const idempotenceKey = `${Date.now()}-${Math.random()}`;
    const body = {
      amount: {
        value: ((input.amount as number) / 100).toFixed(2),
        currency: (input.currency_code ?? "RUB").toUpperCase(),
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000"}/checkout/success`,
      },
      capture: false,
      description: `Заказ Vita Brava Home`,
      metadata: input.context ?? {},
    };

    const res = await fetch(`${YOOKASSA_API}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.basicAuth()}`,
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as {
      id: string;
      confirmation?: { confirmation_url?: string };
      status: string;
    };

    return {
      id: data.id,
      data: {
        id: data.id,
        confirmationUrl: data.confirmation?.confirmation_url ?? null,
        status: data.status,
      },
    };
  }

  // ── authorizePayment ─────────────────────────────────────────────────────────
  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const externalId = input.data?.id as string | undefined;

    if (this.isStub || !externalId) {
      return { data: input.data ?? {}, status: "authorized" };
    }

    const res = await fetch(`${YOOKASSA_API}/payments/${externalId}`, {
      headers: { Authorization: `Basic ${this.basicAuth()}` },
    });
    const payment = (await res.json()) as { status: string };

    const status =
      payment.status === "waiting_for_capture" || payment.status === "succeeded"
        ? "authorized"
        : payment.status === "canceled"
          ? "canceled"
          : "pending";

    return { data: input.data ?? {}, status };
  }

  // ── capturePayment ───────────────────────────────────────────────────────────
  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const externalId = input.data?.id as string | undefined;

    if (this.isStub || !externalId) {
      return { data: input.data ?? {} };
    }

    const res = await fetch(`${YOOKASSA_API}/payments/${externalId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.basicAuth()}`,
        "Idempotence-Key": `capture-${externalId}`,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    return { data: data as Record<string, unknown> };
  }

  // ── cancelPayment ────────────────────────────────────────────────────────────
  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const externalId = input.data?.id as string | undefined;

    if (this.isStub || !externalId) {
      return { data: input.data ?? {} };
    }

    const res = await fetch(`${YOOKASSA_API}/payments/${externalId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.basicAuth()}`,
        "Idempotence-Key": `cancel-${externalId}`,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    return { data: data as Record<string, unknown> };
  }

  // ── refundPayment ────────────────────────────────────────────────────────────
  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const externalId = input.data?.id as string | undefined;

    if (this.isStub || !externalId) {
      return { data: input.data ?? {} };
    }

    const res = await fetch(`${YOOKASSA_API}/refunds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.basicAuth()}`,
        "Idempotence-Key": `refund-${externalId}-${Date.now()}`,
      },
      body: JSON.stringify({
        payment_id: externalId,
        amount: {
          value: ((input.amount as number) / 100).toFixed(2),
          currency: "RUB",
        },
      }),
    });

    const data = await res.json();
    return { data: data as Record<string, unknown> };
  }

  // ── retrievePayment ──────────────────────────────────────────────────────────
  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const externalId = input.data?.id as string | undefined;

    if (this.isStub || !externalId) {
      return { data: input.data ?? {} };
    }

    const res = await fetch(`${YOOKASSA_API}/payments/${externalId}`, {
      headers: { Authorization: `Basic ${this.basicAuth()}` },
    });
    const data = await res.json();
    return { data: data as Record<string, unknown> };
  }

  // ── deletePayment ────────────────────────────────────────────────────────────
  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    // YooKassa не поддерживает удаление — отменяем
    const externalId = input.data?.id as string | undefined;

    if (this.isStub || !externalId) {
      return { data: {} };
    }

    await fetch(`${YOOKASSA_API}/payments/${externalId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.basicAuth()}`,
        "Idempotence-Key": `delete-${externalId}`,
      },
      body: JSON.stringify({}),
    });

    return { data: {} };
  }

  // ── getPaymentStatus ─────────────────────────────────────────────────────────
  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const externalId = input.data?.id as string | undefined;

    if (this.isStub || !externalId || (externalId as string).startsWith("pay_stub_")) {
      return { status: "pending" };
    }

    const res = await fetch(`${YOOKASSA_API}/payments/${externalId}`, {
      headers: { Authorization: `Basic ${this.basicAuth()}` },
    });
    const payment = (await res.json()) as { status: string };

    switch (payment.status) {
      case "waiting_for_capture":
        return { status: "authorized" };
      case "succeeded":
        return { status: "captured" };
      case "canceled":
        return { status: "canceled" };
      default:
        return { status: "pending" };
    }
  }

  // ── getWebhookActionAndData ──────────────────────────────────────────────────
  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const body = payload.data as {
      event?: string;
      object?: { id?: string; status?: string; amount?: { value?: string } };
    };

    const event = body.event ?? "";
    const paymentId = body.object?.id ?? "";
    const amount = Math.round(parseFloat(body.object?.amount?.value ?? "0") * 100);

    if (event === "payment.succeeded") {
      return {
        action: "captured",
        data: { session_id: paymentId, amount },
      };
    }

    if (event === "payment.canceled") {
      return {
        action: "not_supported",
        data: { session_id: paymentId, amount },
      };
    }

    if (event === "refund.succeeded") {
      return {
        action: "refunded",
        data: { session_id: paymentId, amount },
      };
    }

    return { action: "not_supported" };
  }
}
