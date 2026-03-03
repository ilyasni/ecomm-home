/**
 * POST /api/cart/shipping — добавить метод доставки к корзине Medusa.
 *
 * Body: { option_id: string }
 * Response: { cart } | { error }
 *
 * option_id — ID из GET /api/cart/shipping-options.
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

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return NextResponse.json({ error: "No cart" }, { status: 400 });
  }

  let option_id: string;
  try {
    const body = await req.json();
    option_id = String(body.option_id ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!option_id) {
    return NextResponse.json({ error: "option_id required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers: medusaHeaders(),
      body: JSON.stringify({ option_id }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[/api/cart/shipping]", res.status, text.slice(0, 300));
      return NextResponse.json({ error: "Failed to add shipping method" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ cart: data.cart });
  } catch (err) {
    console.error("[/api/cart/shipping]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
