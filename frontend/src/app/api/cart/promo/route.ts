/**
 * POST /api/cart/promo — валидация промокода через Medusa Promotions API
 *
 * Body: { code: string }
 * Response (success):  { valid: true, code, discount: { type, value } }
 * Response (invalid):  { valid: false, message: string }
 *
 * Аутентифицируется с Medusa Admin API server-side (credentials из env).
 * Коды создаются скриптом: tmp_migration/create-medusa-promotions.mjs
 */

import { NextResponse } from "next/server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://medusa:9000";
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD ?? "";

// Кэш admin-токена в памяти процесса (сбрасывается при рестарте)
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAdminToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Medusa admin auth failed: ${res.status}`);
  }

  const data = await res.json();
  if (!data.token) {
    throw new Error("Medusa admin auth: no token in response");
  }

  // JWT живёт ~24 часа, кэшируем на 23 часа
  cachedToken = { token: data.token, expiresAt: now + 23 * 60 * 60 * 1000 };
  return data.token;
}

export async function POST(req: Request) {
  let code: string;
  try {
    const body = await req.json();
    code = String(body.code ?? "").trim();
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request" }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ valid: false, message: "Введите промокод" }, { status: 400 });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json(
      { valid: false, message: "Промокоды временно недоступны" },
      { status: 503 }
    );
  }

  try {
    const token = await getAdminToken();

    // Ищем промокод в Medusa (exact match, case-insensitive через toUpperCase)
    const promoRes = await fetch(
      `${MEDUSA_URL}/admin/promotions?code[]=${encodeURIComponent(code.toUpperCase())}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!promoRes.ok) {
      throw new Error(`Promotions API error: ${promoRes.status}`);
    }

    const promoData = await promoRes.json();
    const promotion = promoData.promotions?.find(
      (p: { code: string; status: string }) =>
        p.code.toUpperCase() === code.toUpperCase() && p.status === "active"
    );

    if (!promotion) {
      return NextResponse.json({ valid: false, message: "Промокод не найден или недействителен" });
    }

    const method = promotion.application_method;
    const discountValue = Number(method?.raw_value?.value ?? method?.value ?? 0);

    return NextResponse.json({
      valid: true,
      code: promotion.code,
      discount: {
        type: method?.type as "percentage" | "fixed",
        value: discountValue,
      },
    });
  } catch (err) {
    console.error("[/api/cart/promo]", err);
    return NextResponse.json(
      { valid: false, message: "Не удалось проверить промокод. Попробуйте позже." },
      { status: 500 }
    );
  }
}
