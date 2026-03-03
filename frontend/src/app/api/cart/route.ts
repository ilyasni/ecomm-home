/**
 * /api/cart — Medusa Cart API proxy
 *
 * GET  → возвращает корзину по cart_id из cookie
 * POST → создаёт новую корзину, сохраняет cart_id в httpOnly cookie
 *
 * Используется checkout-ом (Phase 2.5) для создания Medusa Order.
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

export async function GET() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) {
    return NextResponse.json({ cart: null });
  }

  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      headers: medusaHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ cart: null });
    }
    const data = await res.json();
    return NextResponse.json({ cart: data.cart });
  } catch {
    return NextResponse.json({ cart: null });
  }
}

export async function POST(req: Request) {
  let region_id: string | undefined;
  try {
    const body = await req.json();
    region_id = body.region_id;
  } catch {
    // body может быть пустым
  }

  // Если region_id не передан — найти RUB регион
  if (!region_id) {
    try {
      const regRes = await fetch(`${MEDUSA_URL}/store/regions`, {
        headers: medusaHeaders(),
        next: { revalidate: 3600 },
      });
      if (regRes.ok) {
        const regData = await regRes.json();
        const rubRegion = regData.regions?.find(
          (r: { currency_code: string; id: string }) => r.currency_code === "rub"
        );
        region_id = rubRegion?.id ?? regData.regions?.[0]?.id;
      }
    } catch {
      // fallback — используем известный ID
      region_id = "reg_01KJG7NT22W2WTVAVZ9ZREEYMZ";
    }
  }

  if (!region_id) {
    return NextResponse.json({ error: "No region available" }, { status: 500 });
  }

  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: "POST",
      headers: medusaHeaders(),
      body: JSON.stringify({ region_id }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    const cartId: string = data.cart.id;

    const response = NextResponse.json({ cart: data.cart });
    response.cookies.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
