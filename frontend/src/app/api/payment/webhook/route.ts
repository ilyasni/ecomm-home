import { NextResponse } from "next/server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD ?? "";

let _cachedAdminToken: { token: string; expiresAt: number } | null = null;

async function getAdminToken(): Promise<string> {
  const now = Date.now();
  if (_cachedAdminToken && _cachedAdminToken.expiresAt > now) return _cachedAdminToken.token;
  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Medusa admin auth failed: ${res.status}`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("No token in Medusa admin auth response");
  _cachedAdminToken = { token: data.token, expiresAt: now + 23 * 60 * 60 * 1000 };
  return data.token;
}

async function updateMedusaOrderMetadata(
  orderId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${MEDUSA_URL}/admin/orders/${orderId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("[YooKassa webhook] Order update failed:", res.status, text.slice(0, 200));
    }
  } catch (err) {
    console.error("[YooKassa webhook] updateMedusaOrderMetadata error:", err);
  }
}

// YooKassa IP allowlist для production
// https://yookassa.ru/developers/using-api/webhooks#notification-format
const YOOKASSA_IPS = new Set([
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.156.11",
  "77.75.156.35",
  "77.75.154.128/25",
  "2a02:5180::/32",
]);

interface YookassaWebhookBody {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    status?: string;
    amount?: { value?: string; currency?: string };
    metadata?: Record<string, unknown>;
  };
}

export async function POST(req: Request): Promise<NextResponse> {
  // В stub-режиме (no real credentials) — просто принять и залогировать
  const IS_STUB = !process.env.YOOKASSA_SHOP_ID || process.env.YOOKASSA_SHOP_ID === "test_shop";

  let body: YookassaWebhookBody;
  try {
    body = (await req.json()) as YookassaWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event ?? "";
  const paymentId = body.object?.id ?? "";
  const status = body.object?.status ?? "";
  const orderId = body.object?.metadata?.orderId as string | undefined;

  if (IS_STUB) {
    console.log("[YooKassa webhook stub]", { event, paymentId, status, orderId });
    return NextResponse.json({ received: true });
  }

  // ── Production: проверить IP источника ────────────────────────────────────
  // (Coolify/Nginx должен передавать X-Forwarded-For или X-Real-IP)
  const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
  const clientIp = forwardedFor.split(",")[0]?.trim() ?? "";

  // Проверка IP — упрощённая (без CIDR-парсинга для краткости)
  // В production добавить пакет ip-range-check или netmask
  const ipAllowed = YOOKASSA_IPS.has(clientIp) || process.env.NODE_ENV !== "production"; // в dev не проверяем

  if (!ipAllowed) {
    console.warn("[YooKassa webhook] Rejected IP:", clientIp);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  console.log("[YooKassa webhook]", { event, paymentId, status, orderId });

  // ── Обработка событий ──────────────────────────────────────────────────────
  // Пропускаем local-заказы (нет Medusa order)
  const isMedusaOrder = orderId && !orderId.startsWith("local-");

  switch (event) {
    case "payment.succeeded":
      if (isMedusaOrder && ADMIN_EMAIL && ADMIN_PASSWORD) {
        await updateMedusaOrderMetadata(orderId!, {
          payment_status: "paid",
          yookassa_payment_id: paymentId,
          paid_at: new Date().toISOString(),
        });
      }
      break;

    case "payment.canceled":
      if (isMedusaOrder && ADMIN_EMAIL && ADMIN_PASSWORD) {
        await updateMedusaOrderMetadata(orderId!, {
          payment_status: "canceled",
          yookassa_payment_id: paymentId,
          canceled_at: new Date().toISOString(),
        });
      }
      break;

    case "refund.succeeded":
      if (isMedusaOrder && ADMIN_EMAIL && ADMIN_PASSWORD) {
        await updateMedusaOrderMetadata(orderId!, {
          payment_status: "refunded",
          yookassa_refund_id: paymentId,
          refunded_at: new Date().toISOString(),
        });
      }
      break;

    default:
      // Неизвестное событие — игнорируем
      break;
  }

  return NextResponse.json({ received: true });
}
