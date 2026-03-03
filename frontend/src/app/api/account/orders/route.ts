import { NextResponse } from "next/server";
import { getAuthTokenFromCookie, getSessionCookieValue } from "@/lib/auth/server";
import { getMedusaStoreHeaders } from "@/lib/medusa";
import type { MedusaOrder } from "@/types/medusa";

const MEDUSA_URL =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://medusa:9000";

// GET /api/account/orders — заказы текущего customer из Medusa Store API
export async function GET() {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ orders: [] });
    }

    const sessionValue = await getSessionCookieValue();
    const res = await fetch(`${MEDUSA_URL}/store/orders`, {
      headers: getMedusaStoreHeaders({ sessionValue, authToken: token }),
      cache: "no-store",
    });

    if (!res.ok) {
      // Medusa недоступна или нет прав → graceful empty list
      return NextResponse.json({ orders: [] });
    }

    const data = (await res.json()) as { orders?: MedusaOrder[] };
    return NextResponse.json({ orders: data.orders ?? [] });
  } catch {
    // stub-режим или Medusa offline → empty list
    return NextResponse.json({ orders: [] });
  }
}
