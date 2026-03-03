/**
 * POST /api/cart/complete — завершить корзину и создать Medusa Order.
 *
 * Прикрепляет auth-токен customer (если залогинен) → заказ будет customer-bound.
 *
 * Response (success): { type: "order", order: { id, display_id, ... } }
 * Response (failure): { type: "cart", error: string }
 *
 * Требует: настроенные shipping providers и payment providers в Medusa.
 * В stub-режиме (без настроенных providers) вернёт type: "cart" с ошибкой —
 * checkout должен обработать это и при необходимости использовать legacy fallback.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getSessionCookieValue } from "@/lib/auth/server";
import { getMedusaStoreHeaders } from "@/lib/medusa";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const CART_COOKIE = "medusa_cart_id";

export async function POST() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return NextResponse.json({ type: "cart", error: "No cart found" }, { status: 400 });
  }

  // Если customer залогинен — прикрепляем токен/сессию → заказ будет customer-bound
  const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const sessionValue = await getSessionCookieValue();

  try {
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers: getMedusaStoreHeaders({ sessionValue, authToken }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[/api/cart/complete]", res.status, text.slice(0, 400));
      return NextResponse.json(
        { type: "cart", error: `Medusa error ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (data.type === "order") {
      // Очищаем cart cookie после успешного создания заказа
      const response = NextResponse.json({ type: "order", order: data.order });
      response.cookies.set(CART_COOKIE, "", { maxAge: 0, path: "/" });
      return response;
    }

    // type === "cart" — ошибка на стороне Medusa (нет shipping/payment provider)
    return NextResponse.json({
      type: "cart",
      error: data.error ?? "Cart could not be completed",
    });
  } catch (err) {
    console.error("[/api/cart/complete]", err);
    return NextResponse.json({ type: "cart", error: "Internal error" }, { status: 500 });
  }
}
