/**
 * PUT /api/cart/address — обновить адрес доставки и email в корзине Medusa.
 *
 * Body: { email, first_name?, last_name?, address_1?, city?, phone?, country_code? }
 * Response: { cart } | { error }
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionCookieValue } from "@/lib/auth/server";
import { getMedusaStoreHeaders } from "@/lib/medusa";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const CART_COOKIE = "medusa_cart_id";

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return NextResponse.json({ error: "No cart" }, { status: 400 });
  }

  let body: {
    email: string;
    first_name?: string;
    last_name?: string;
    address_1?: string;
    city?: string;
    phone?: string;
    country_code?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, first_name, last_name, address_1, city, phone, country_code = "ru" } = body;

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  try {
    const sessionValue = await getSessionCookieValue();
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      method: "POST",
      headers: getMedusaStoreHeaders({ sessionValue }),
      body: JSON.stringify({
        email,
        shipping_address: {
          first_name: first_name ?? "",
          last_name: last_name ?? "",
          address_1: address_1 ?? "—",
          city: city ?? "Москва",
          country_code,
          phone: phone ?? "",
        },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[/api/cart/address]", res.status, text.slice(0, 300));
      return NextResponse.json({ error: "Failed to update address" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ cart: data.cart });
  } catch (err) {
    console.error("[/api/cart/address]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
