/**
 * POST /api/cart/sync — синхронизировать localStorage корзину с Medusa Cart
 *
 * Принимает items из localStorage, находит variant_id в Medusa через Strapi,
 * добавляет в Medusa корзину. Вызывается из checkout перед address/complete.
 *
 * Body: { items: CartSyncItem[] }
 * Response: { cartId: string; synced: number; skipped: number }
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://cms:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? "";
const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL ?? "http://medusa:9000";
const PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY ?? "";
const REGION_ID_FALLBACK = "reg_01KJG7NT22W2WTVAVZ9ZREEYMZ";
const CART_COOKIE = "medusa_cart_id";

interface CartSyncItem {
  id: string; // Strapi documentId
  title: string;
  quantity: number;
  size?: string;
}

function medusaHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
  };
}

function strapiHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
  };
}

/** Получить или создать Medusa корзину, вернуть cartId */
async function ensureCart(): Promise<string | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) return existing;

  // Найти RUB регион
  let regionId = REGION_ID_FALLBACK;
  try {
    const regRes = await fetch(`${MEDUSA_URL}/store/regions`, {
      headers: medusaHeaders(),
    });
    if (regRes.ok) {
      const regData = await regRes.json();
      const rub = regData.regions?.find(
        (r: { currency_code: string; id: string }) => r.currency_code === "rub"
      );
      if (rub?.id) regionId = rub.id;
    }
  } catch {
    // fallback к REGION_ID_FALLBACK
  }

  const res = await fetch(`${MEDUSA_URL}/store/carts`, {
    method: "POST",
    headers: medusaHeaders(),
    body: JSON.stringify({ region_id: regionId }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart?.id ?? null;
}

/** Найти medusa_product_id по Strapi documentId */
async function getMedusaProductId(strapiDocumentId: string): Promise<string | null> {
  try {
    const url = `${STRAPI_URL}/api/products?filters[documentId][$eq]=${encodeURIComponent(strapiDocumentId)}&fields=medusa_product_id&pagination[limit]=1`;
    const res = await fetch(url, { headers: strapiHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.data?.[0]?.medusa_product_id as string | undefined) ?? null;
  } catch {
    return null;
  }
}

interface MedusaVariantOption {
  value: string;
}

interface MedusaVariantRaw {
  id: string;
  options?: MedusaVariantOption[];
}

/** Найти variant_id по medusa_product_id и label размера */
async function findVariantId(
  medusaProductId: string,
  sizeLabel: string | undefined
): Promise<string | null> {
  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products/${medusaProductId}?fields=variants,variants.options`,
      { headers: medusaHeaders() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const variants: MedusaVariantRaw[] = data.product?.variants ?? [];
    if (variants.length === 0) return null;

    const target = sizeLabel ?? "Default";

    // Ищем вариант, у которого options[0].value совпадает с target
    const matched = variants.find((v) =>
      v.options?.some((opt) => opt.value.toLowerCase() === target.toLowerCase())
    );
    // Если не нашли по label — берём первый (единственный Default-вариант)
    return matched?.id ?? variants[0]?.id ?? null;
  } catch {
    return null;
  }
}

/** Добавить line item в Medusa корзину */
async function addLineItem(cartId: string, variantId: string, quantity: number): Promise<boolean> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers: medusaHeaders(),
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let items: CartSyncItem[] = [];
  try {
    const body = await req.json();
    items = Array.isArray(body.items) ? body.items : [];
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ cartId: null, synced: 0, skipped: 0 });
  }

  // Создать / найти корзину
  const cartId = await ensureCart();
  if (!cartId) {
    return NextResponse.json({ error: "Could not create Medusa cart" }, { status: 500 });
  }

  let synced = 0;
  let skipped = 0;

  for (const item of items) {
    // Найти medusa_product_id в Strapi
    const medusaProductId = await getMedusaProductId(item.id);
    if (!medusaProductId) {
      console.warn(`[cart/sync] No medusa_product_id for Strapi documentId=${item.id}, skipping`);
      skipped++;
      continue;
    }

    // Найти подходящий variant
    const variantId = await findVariantId(medusaProductId, item.size);
    if (!variantId) {
      console.warn(
        `[cart/sync] No variant found for product=${medusaProductId} size=${item.size}, skipping`
      );
      skipped++;
      continue;
    }

    const ok = await addLineItem(cartId, variantId, item.quantity);
    if (ok) {
      synced++;
    } else {
      console.warn(`[cart/sync] Failed to add variant=${variantId} to cart=${cartId}`);
      skipped++;
    }
  }

  // Сохранить cartId в cookie (если создали новую корзину)
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(CART_COOKIE)?.value;

  const response = NextResponse.json({ cartId, synced, skipped });
  if (!existingCookie) {
    response.cookies.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return response;
}
