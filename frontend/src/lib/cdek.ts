/**
 * CDEK API v2 — сервисный модуль для Next.js API routes.
 *
 * Stub-режим активен пока CDEK_CLIENT_ID === "test_client" или не задан.
 * Для подключения реального API задайте env vars:
 *   CDEK_CLIENT_ID, CDEK_CLIENT_SECRET, CDEK_FROM_CITY_CODE (опционально, default: 44 = Москва)
 */

const CDEK_API = "https://api.cdek.ru/v2";

export const IS_CDEK_STUB =
  !process.env.CDEK_CLIENT_ID || process.env.CDEK_CLIENT_ID === "test_client";

/** Код города отправки (склад). Default: 44 = Москва */
export const FROM_CITY_CODE = Number(process.env.CDEK_FROM_CITY_CODE ?? 44);

/** Маппинг ID городов из account.ts → коды CDEK */
export const CDEK_CITY_CODES: Record<string, number> = {
  msk: 44,
  spb: 137,
  tvr: 717,
  kzn: 270,
  nsk: 399,
  ekb: 2686,
};

/** Тариф 136 — «Посылка склад-дверь» */
export const TARIFF_DOOR = 136;

// ── OAuth token cache ──────────────────────────────────────────────────────────
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getCdekToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch(`${CDEK_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.CDEK_CLIENT_ID ?? "",
      client_secret: process.env.CDEK_CLIENT_SECRET ?? "",
    }),
  });

  if (!res.ok) {
    throw new Error(`CDEK OAuth failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Кэшировать на 55 минут (expires_in обычно 3600s)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + Math.min(data.expires_in - 300, 3300) * 1000,
  };
  return cachedToken.token;
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CdekCalculateResult {
  price: number;
  periodMin: number;
  periodMax: number;
  tariffCode: number;
}

export interface CdekOrderItem {
  title: string;
  quantity: number;
}

export interface CdekOrderInput {
  orderId: string;
  toAddress: string;
  toCityId: string;
  customerName: string;
  phone: string;
  items: CdekOrderItem[];
}

export interface CdekOrderResult {
  cdekUuid: string;
  status: string;
}

// ── Calculate delivery ─────────────────────────────────────────────────────────

export async function calculateCdekDelivery(
  toCityId: string,
  weightGrams = 1000
): Promise<CdekCalculateResult> {
  if (IS_CDEK_STUB) {
    return { price: 390, periodMin: 3, periodMax: 5, tariffCode: TARIFF_DOOR };
  }

  const toCityCode = CDEK_CITY_CODES[toCityId] ?? CDEK_CITY_CODES.msk;
  const token = await getCdekToken();

  const body = {
    tariff_code: TARIFF_DOOR,
    from_location: { code: FROM_CITY_CODE },
    to_location: { code: toCityCode },
    packages: [
      {
        weight: weightGrams,
        length: 30,
        width: 20,
        height: 10,
      },
    ],
  };

  const res = await fetch(`${CDEK_API}/calculator/tarifflist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Если API недоступен — fallback на дефолтную цену
    return { price: 390, periodMin: 3, periodMax: 5, tariffCode: TARIFF_DOOR };
  }

  const data = (await res.json()) as {
    tariff_codes?: Array<{
      tariff_code: number;
      delivery_sum: number;
      period_min: number;
      period_max: number;
    }>;
  };

  const tariff = data.tariff_codes?.find((t) => t.tariff_code === TARIFF_DOOR);

  return {
    price: Math.ceil(tariff?.delivery_sum ?? 390),
    periodMin: tariff?.period_min ?? 3,
    periodMax: tariff?.period_max ?? 5,
    tariffCode: TARIFF_DOOR,
  };
}

// ── Create CDEK order ──────────────────────────────────────────────────────────

export async function createCdekOrder(input: CdekOrderInput): Promise<CdekOrderResult> {
  if (IS_CDEK_STUB) {
    console.log("[CDEK order stub]", {
      cdekUuid: `cdek_stub_${Date.now()}`,
      orderId: input.orderId,
    });
    return { cdekUuid: `cdek_stub_${Date.now()}`, status: "accepted" };
  }

  const toCityCode = CDEK_CITY_CODES[input.toCityId] ?? CDEK_CITY_CODES.msk;
  const [firstName, ...lastParts] = input.customerName.split(" ");
  const lastName = lastParts.join(" ") || firstName;

  const token = await getCdekToken();

  const orderBody = {
    tariff_code: TARIFF_DOOR,
    comment: `Заказ ${input.orderId}`,
    sender: {
      company: "Vita Brava Home",
      phones: [{ number: "+74951234567" }],
    },
    from_location: {
      code: FROM_CITY_CODE,
      address: process.env.CDEK_FROM_ADDRESS ?? "г. Москва",
    },
    to_location: {
      code: toCityCode,
      address: input.toAddress,
    },
    recipient: {
      name: input.customerName,
      phones: [{ number: input.phone }],
    },
    packages: [
      {
        number: input.orderId,
        weight: 1000,
        length: 30,
        width: 20,
        height: 10,
        items: input.items.map((item, idx) => ({
          name: item.title,
          ware_key: `item-${idx}`,
          payment: { value: 0 },
          cost: 0,
          weight: Math.round(1000 / input.items.length),
          amount: item.quantity,
        })),
      },
    ],
  };

  const res = await fetch(`${CDEK_API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderBody),
  });

  if (!res.ok) {
    console.error("[CDEK createOrder] failed:", res.status);
    return { cdekUuid: `cdek_error_${Date.now()}`, status: "error" };
  }

  const data = (await res.json()) as {
    entity?: { uuid?: string };
    requests?: Array<{ state?: string }>;
  };
  return {
    cdekUuid: data.entity?.uuid ?? `cdek_unknown_${Date.now()}`,
    status: data.requests?.[0]?.state ?? "accepted",
  };
}
