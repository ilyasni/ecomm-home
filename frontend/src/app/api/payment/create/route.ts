import { NextResponse } from "next/server";

const YOOKASSA_API = "https://api.yookassa.ru/v3";

const SHOP_ID = process.env.YOOKASSA_SHOP_ID ?? "test_shop";
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY ?? "test_secret_key";

const IS_STUB =
  !SHOP_ID || SHOP_ID === "test_shop" || !SECRET_KEY || SECRET_KEY === "test_secret_key";

function basicAuth(): string {
  return Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64");
}

interface CreatePaymentBody {
  orderId?: string;
  amount?: number;
  method?: string;
  customerEmail?: string;
}

interface YookassaPayment {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
}

const METHOD_LABELS: Record<string, string> = {
  card: "bank_card",
  sbp: "sbp",
  "yandex-pay": "yandex_pay",
};

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as CreatePaymentBody;
  const { orderId, amount = 0, method = "card", customerEmail } = body;

  // ── Stub mode ──────────────────────────────────────────────────────────────
  if (IS_STUB) {
    return NextResponse.json({
      paymentId: `pay_stub_${Date.now()}`,
      confirmationUrl: "stub",
      status: "pending",
    });
  }

  // ── Real YooKassa ──────────────────────────────────────────────────────────
  const idempotenceKey = `${orderId ?? "no-order"}-${Date.now()}`;
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

  const paymentType = METHOD_LABELS[method] ?? "bank_card";

  const yookassaBody = {
    amount: {
      value: (amount / 100).toFixed(2),
      currency: "RUB",
    },
    confirmation: {
      type: "redirect",
      return_url: `${frontendUrl}/checkout/success?orderId=${encodeURIComponent(orderId ?? "")}`,
    },
    capture: true,
    description: `Заказ Vita Brava Home${orderId ? ` №${orderId}` : ""}`,
    payment_method_data: { type: paymentType },
    receipt: customerEmail
      ? {
          customer: { email: customerEmail },
          items: [
            {
              description: "Товары",
              quantity: "1.00",
              amount: { value: (amount / 100).toFixed(2), currency: "RUB" },
              vat_code: 1,
            },
          ],
        }
      : undefined,
    metadata: { orderId: orderId ?? "", method },
  };

  const res = await fetch(`${YOOKASSA_API}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth()}`,
      "Idempotence-Key": idempotenceKey,
    },
    body: JSON.stringify(yookassaBody),
  });

  if (!res.ok) {
    const err = (await res.json()) as { description?: string };
    return NextResponse.json({ error: err.description ?? "YooKassa error" }, { status: 502 });
  }

  const payment = (await res.json()) as YookassaPayment;

  return NextResponse.json({
    paymentId: payment.id,
    confirmationUrl: payment.confirmation?.confirmation_url ?? null,
    status: payment.status,
  });
}
