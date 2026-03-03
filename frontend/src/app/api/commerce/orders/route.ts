/**
 * POST /api/commerce/orders — создание заказа через Medusa Admin Draft Orders API.
 *
 * Принимает корзину из localStorage-cart и создаёт Draft Order в Medusa
 * с кастомными позициями (без variant_id — custom items).
 * При ошибке Medusa возвращает { id: null } — checkout gracefully fallback на localStorage.
 */

import { NextResponse } from "next/server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD ?? "";

// Кэш admin-токена в памяти процесса (~23ч)
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

async function getRubRegionId(): Promise<string | null> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": process.env.MEDUSA_PUBLISHABLE_KEY ?? "",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const region = (data.regions ?? []).find(
      (r: { currency_code: string; id: string }) => r.currency_code === "rub"
    );
    return region?.id ?? null;
  } catch {
    return null;
  }
}

/** "1 200 ₽" → 120000 копеек */
function parseRubToKopecks(price: string): number {
  const clean = price.replace(/[^\d.,]/g, "").replace(",", ".");
  return Math.round((parseFloat(clean) || 0) * 100);
}

function parseName(name: string): { first_name: string; last_name: string } {
  const parts = name.trim().split(/\s+/);
  return {
    first_name: parts[0] ?? "Покупатель",
    last_name: parts.slice(1).join(" ") || "",
  };
}

export async function POST(request: Request) {
  let body: {
    customerName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    paymentMethod: string;
    deliveryMethod: string;
    total?: string;
    promoCode?: string;
    items?: Array<{ title: string; quantity: number; price: string }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ id: null }, { status: 400 });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn("[/api/commerce/orders] Medusa admin credentials not configured");
    return NextResponse.json({ id: null });
  }

  try {
    const token = await getAdminToken();
    const regionId = await getRubRegionId();

    if (!regionId) {
      console.warn("[/api/commerce/orders] RUB region not found");
      return NextResponse.json({ id: null });
    }

    const { first_name, last_name } = parseName(body.customerName ?? "");

    const items = (body.items ?? [])
      .filter((item) => item.title && item.quantity > 0)
      .map((item) => ({
        title: item.title,
        quantity: Number(item.quantity) || 1,
        unit_price: parseRubToKopecks(item.price),
      }));

    const draftRes = await fetch(`${MEDUSA_URL}/admin/draft-orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        region_id: regionId,
        shipping_address: {
          first_name,
          last_name,
          address_1: body.deliveryAddress || "—",
          city: "Москва",
          country_code: "ru",
          phone: body.phone,
        },
        items,
        metadata: {
          phone: body.phone,
          customer_name: body.customerName,
          payment_method: body.paymentMethod,
          delivery_method: body.deliveryMethod,
          promo_code: body.promoCode ?? null,
        },
      }),
    });

    if (!draftRes.ok) {
      const errText = await draftRes.text().catch(() => "");
      console.error(
        `[/api/commerce/orders] Draft order ${draftRes.status}:`,
        errText.slice(0, 400)
      );
      return NextResponse.json({ id: null });
    }

    const draftData = await draftRes.json();
    const orderId: string | null = draftData.draft_order?.id ?? draftData.order?.id ?? null;

    return NextResponse.json({ id: orderId });
  } catch (err) {
    console.error("[/api/commerce/orders]", err);
    return NextResponse.json({ id: null });
  }
}
