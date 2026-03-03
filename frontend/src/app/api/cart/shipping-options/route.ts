/**
 * GET /api/cart/shipping-options — список доступных опций доставки для текущей корзины.
 *
 * Требует: cart_id в cookie + настроенные shipping providers в Medusa.
 * В stub-режиме (Medusa не настроена) возвращает пустой массив — это не ошибка.
 *
 * Response: { shipping_options: ShippingOption[] }
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
    return NextResponse.json({ shipping_options: [] });
  }

  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/shipping-options?cart_id=${encodeURIComponent(cartId)}`,
      {
        headers: medusaHeaders(),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ shipping_options: [] });
    }

    const data = await res.json();
    return NextResponse.json({ shipping_options: data.shipping_options ?? [] });
  } catch {
    return NextResponse.json({ shipping_options: [] });
  }
}
