/**
 * GET /api/commerce/orders/[id] — получение данных заказа из Medusa Admin API.
 *
 * Поддерживает:
 *  - Draft orders: id начинается с "dorder_" → GET /admin/draft-orders/{id}
 *  - Real orders: id начинается с "order_"  → GET /admin/orders/{id}
 *
 * Response: { id, orderNumber, total, paymentLabel, deliveryAddress, recipient, recipientPhone, items[] }
 */

import { NextResponse } from "next/server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD ?? "";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAdminToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.token;

  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Medusa auth failed: ${res.status}`);

  const data = await res.json();
  if (!data.token) throw new Error("No token in auth response");
  cachedToken = { token: data.token, expiresAt: now + 23 * 60 * 60 * 1000 };
  return data.token;
}

/** Kopecks → "1 200 ₽" */
function formatRubFromKopecks(kopecks: number): string {
  return `${Math.round(kopecks / 100).toLocaleString("ru-RU")} ₽`;
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Commerce not configured" }, { status: 503 });
  }

  try {
    const token = await getAdminToken();
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const isDraft = id.startsWith("dorder_");
    const endpoint = isDraft ? `/admin/draft-orders/${id}` : `/admin/orders/${id}`;

    const res = await fetch(`${MEDUSA_URL}${endpoint}`, {
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const data = await res.json();
    const order = data.draft_order ?? data.order;
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const meta = (order.metadata ?? {}) as Record<string, string>;
    const addr = order.shipping_address ?? {};
    const recipient = [addr.first_name, addr.last_name].filter(Boolean).join(" ");

    return NextResponse.json({
      id: order.id,
      orderNumber: order.display_id ?? order.id,
      total: formatRubFromKopecks(order.total ?? 0),
      paymentLabel: meta.payment_method ?? "Оплата при получении",
      deliveryAddress: addr.address_1 ?? "—",
      recipient: recipient || meta.customer_name || "Покупатель",
      recipientPhone: addr.phone ?? meta.phone ?? "—",
      items: (order.items ?? []).map(
        (item: { id: string; title: string; thumbnail?: string | null; quantity: number }) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail ?? "/assets/figma/placeholder.svg",
          quantity: item.quantity,
        })
      ),
    });
  } catch (err) {
    console.error("[/api/commerce/orders/[id]]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
