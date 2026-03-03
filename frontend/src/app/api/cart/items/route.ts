/**
 * POST /api/cart/items — добавить товар в Medusa корзину
 * Body: { variant_id: string; quantity?: number }
 *
 * Если корзина не создана — создаёт её автоматически.
 * Используется при оформлении заказа (Phase 2.5).
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY ?? "";
const CART_COOKIE = "medusa_cart_id";

function medusaHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
  };
}

async function ensureCart(region_id = "reg_01KJG7NT22W2WTVAVZ9ZREEYMZ"): Promise<string | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const res = await fetch(`${MEDUSA_URL}/store/carts`, {
    method: "POST",
    headers: medusaHeaders(),
    body: JSON.stringify({ region_id }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.cart?.id ?? null;
}

export async function POST(req: Request) {
  let variant_id: string;
  let quantity = 1;

  try {
    const body = await req.json();
    variant_id = body.variant_id;
    if (body.quantity) quantity = Number(body.quantity);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!variant_id) {
    return NextResponse.json({ error: "variant_id is required" }, { status: 400 });
  }

  const cartId = await ensureCart();
  if (!cartId) {
    return NextResponse.json({ error: "Could not create cart" }, { status: 500 });
  }

  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers: medusaHeaders(),
      body: JSON.stringify({ variant_id, quantity }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    const response = NextResponse.json({ cart: data.cart });
    response.cookies.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
