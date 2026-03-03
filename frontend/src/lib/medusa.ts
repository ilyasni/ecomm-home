/**
 * Medusa v2 Store API client
 * Server-side only — используется в Server Components и API routes.
 * Для клиентских операций (корзина) используется commerce/store.ts
 * до полного перехода на Medusa (Phase 2.3+).
 */

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";

const MEDUSA_PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY ?? "";

type FetchOptions = {
  method?: string;
  body?: unknown;
  tags?: string[];
  revalidate?: number | false;
};

async function medusaFetch<T>(
  path: string,
  { method = "GET", body, tags, revalidate }: FetchOptions = {}
): Promise<T> {
  const url = `${MEDUSA_BACKEND_URL}/store${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = MEDUSA_PUBLISHABLE_KEY;
  }

  const next: { tags?: string[]; revalidate?: number | false } = {};
  if (tags) next.tags = tags;
  if (revalidate !== undefined) next.revalidate = revalidate;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    next: Object.keys(next).length > 0 ? next : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Medusa ${method} ${path} → ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ── Phase 3.4: централизованные заголовки для Medusa Store API ───────────────

/**
 * Возвращает заголовки для запросов к Medusa Store API.
 * Использует Medusa session (connect.sid) если доступна, иначе Bearer JWT.
 */
export function getMedusaStoreHeaders(options?: {
  sessionValue?: string;
  authToken?: string;
}): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (MEDUSA_PUBLISHABLE_KEY) headers["x-publishable-api-key"] = MEDUSA_PUBLISHABLE_KEY;
  if (options?.sessionValue) {
    headers["Cookie"] = `connect.sid=${options.sessionValue}`;
  } else if (options?.authToken) {
    headers["Authorization"] = `Bearer ${options.authToken}`;
  }
  return headers;
}

// ─── Regions ────────────────────────────────────────────────────────────────

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  countries: { iso_2: string; display_name: string }[];
}

export async function getRegions(): Promise<MedusaRegion[]> {
  const data = await medusaFetch<{ regions: MedusaRegion[] }>("/regions", {
    revalidate: 3600,
    tags: ["medusa-regions"],
  });
  return data.regions;
}

export async function getDefaultRegionId(): Promise<string | null> {
  try {
    const regions = await getRegions();
    return regions.find((r) => r.currency_code === "rub")?.id ?? regions[0]?.id ?? null;
  } catch {
    return null;
  }
}

// ─── Products ───────────────────────────────────────────────────────────────

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  thumbnail: string | null;
  variants: MedusaVariant[];
  images: { id: string; url: string }[];
  metadata: Record<string, unknown> | null;
}

export interface MedusaVariant {
  id: string;
  title: string;
  sku: string | null;
  calculated_price?: {
    calculated_amount: number;
    original_amount: number;
    currency_code: string;
  };
}

export interface MedusaProductListResult {
  products: MedusaProduct[];
  count: number;
  offset: number;
  limit: number;
}

export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  region_id?: string;
}): Promise<MedusaProductListResult> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  if (params?.region_id) query.set("region_id", params.region_id);
  if (params?.category_id) {
    params.category_id.forEach((id) => query.append("category_id[]", id));
  }
  query.set("fields", "+variants.calculated_price");

  const qs = query.toString();
  return medusaFetch<MedusaProductListResult>(`/products${qs ? `?${qs}` : ""}`, {
    revalidate: 300,
    tags: ["medusa-products"],
  });
}

export async function getProduct(
  handle: string,
  region_id?: string
): Promise<MedusaProduct | null> {
  try {
    const query = new URLSearchParams({ handle, fields: "+variants.calculated_price" });
    if (region_id) query.set("region_id", region_id);

    const data = await medusaFetch<{ products: MedusaProduct[] }>(`/products?${query.toString()}`, {
      revalidate: 300,
      tags: [`medusa-product-${handle}`],
    });
    return data.products[0] ?? null;
  } catch {
    return null;
  }
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export interface MedusaCart {
  id: string;
  region_id: string;
  currency_code: string;
  total: number;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  items: MedusaLineItem[];
}

export interface MedusaLineItem {
  id: string;
  title: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  thumbnail: string | null;
  variant: { title: string; sku: string | null } | null;
}

export async function createCart(region_id: string): Promise<MedusaCart> {
  const data = await medusaFetch<{ cart: MedusaCart }>("/carts", {
    method: "POST",
    body: { region_id },
  });
  return data.cart;
}

export async function getCart(cartId: string): Promise<MedusaCart | null> {
  try {
    const data = await medusaFetch<{ cart: MedusaCart }>(`/carts/${cartId}`);
    return data.cart;
  } catch {
    return null;
  }
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<MedusaCart> {
  const data = await medusaFetch<{ cart: MedusaCart }>(`/carts/${cartId}/line-items`, {
    method: "POST",
    body: { variant_id: variantId, quantity },
  });
  return data.cart;
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<MedusaCart> {
  const data = await medusaFetch<{ cart: MedusaCart }>(
    `/carts/${cartId}/line-items/${lineItemId}`,
    { method: "POST", body: { quantity } }
  );
  return data.cart;
}

export async function deleteLineItem(cartId: string, lineItemId: string): Promise<MedusaCart> {
  const data = await medusaFetch<{ cart: MedusaCart }>(
    `/carts/${cartId}/line-items/${lineItemId}`,
    { method: "DELETE" }
  );
  return data.cart;
}
