/**
 * GET  /api/account/bonuses — читает bonus_balance из customer.metadata
 * POST /api/account/bonuses — начисляет бонусы (earn) через Medusa Admin API
 *
 * Бонусы хранятся в customer.metadata.bonus_balance (число, рубли).
 * 1 бонус = 1 ₽. Начисление: 5% от суммы заказа (fire-and-forget из checkout).
 */

import { NextResponse } from "next/server";
import { getAuthTokenFromCookie, getMedusaCustomer } from "@/lib/auth/server";

const MEDUSA_URL =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://medusa:9000";

const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD ?? "";

// Кэш admin-токена (~23ч) — та же схема что в commerce/orders/route.ts
let cachedAdminToken: { token: string; expiresAt: number } | null = null;

async function getAdminToken(): Promise<string> {
  const now = Date.now();
  if (cachedAdminToken && cachedAdminToken.expiresAt > now) return cachedAdminToken.token;

  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Medusa admin auth failed: ${res.status}`);

  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("No token in admin auth response");
  cachedAdminToken = { token: data.token, expiresAt: now + 23 * 60 * 60 * 1000 };
  return data.token;
}

// GET /api/account/bonuses — текущий баланс бонусов
export async function GET() {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ balance: 0 });
    }
    const customer = await getMedusaCustomer(token);
    const balance = Number(customer.metadata?.bonus_balance ?? 0);
    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ balance: 0 });
  }
}

// POST /api/account/bonuses — начислить бонусы (earnedAmount рублей)
export async function POST(req: Request) {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { earnedAmount?: number };
    const earnedAmount = Math.round(Number(body.earnedAmount ?? 0));
    if (earnedAmount <= 0) {
      return NextResponse.json(
        { ok: false, error: "earnedAmount must be positive" },
        { status: 400 }
      );
    }

    // Читаем текущего customer чтобы знать id и текущий баланс
    const customer = await getMedusaCustomer(token);
    const currentBalance = Number(customer.metadata?.bonus_balance ?? 0);
    const newBalance = currentBalance + earnedAmount;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      // В stub-режиме без admin credentials — graceful no-op
      return NextResponse.json({ ok: true, balance: newBalance, stub: true });
    }

    const adminToken = await getAdminToken();
    const res = await fetch(`${MEDUSA_URL}/admin/customers/${customer.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata: { bonus_balance: newBalance } }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[/api/account/bonuses] Admin update failed:", res.status, text.slice(0, 200));
      return NextResponse.json(
        { ok: false, error: "Failed to update bonus balance" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, balance: newBalance });
  } catch (error) {
    console.error("[/api/account/bonuses]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
