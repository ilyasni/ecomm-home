import { cookies } from "next/headers";
import type { MedusaCustomer } from "@/types/medusa";

const MEDUSA_URL =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://medusa:9000";

const PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY ?? "";

export const AUTH_COOKIE_NAME = "vb_auth_token";

function medusaStoreHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (PUBLISHABLE_KEY) headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**
 * Аутентифицирует customer через Medusa emailpass provider.
 * POST /auth/customer/emailpass → { token: "..." }
 */
export async function loginWithMedusa(email: string, password: string): Promise<string> {
  const res = await fetch(`${MEDUSA_URL}/auth/customer/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const json = (await res.json()) as { token?: string; message?: string };
  if (!res.ok) {
    throw new Error(json.message ?? "Authentication failed");
  }
  if (!json.token) throw new Error("No token in auth response");
  return json.token;
}

/**
 * Регистрирует нового customer в Medusa (3 шага).
 * 1. POST /auth/customer/emailpass/register → registration token
 * 2. POST /store/customers с registration token → customer record
 * 3. POST /auth/customer/emailpass (login) → auth JWT
 *
 * Note: registration token ≠ auth token, поэтому нужен шаг 3.
 */
export async function registerWithMedusa(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<string> {
  // Step 1: register identity → получаем registration token
  const regRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email, password: payload.password }),
    cache: "no-store",
  });
  const regJson = (await regRes.json()) as { token?: string; message?: string };
  if (!regRes.ok) {
    throw new Error(regJson.message ?? "Registration failed");
  }
  if (!regJson.token) throw new Error("No token after registration");
  const registrationToken = regJson.token;

  // Step 2: create customer profile с registration token
  const custRes = await fetch(`${MEDUSA_URL}/store/customers`, {
    method: "POST",
    headers: medusaStoreHeaders(registrationToken),
    body: JSON.stringify({
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
    }),
    cache: "no-store",
  });
  if (!custRes.ok) {
    const errJson = (await custRes.json()) as { message?: string };
    throw new Error(errJson.message ?? "Failed to create customer profile");
  }

  // Step 3: login → auth JWT (registration token ≠ auth token)
  return loginWithMedusa(payload.email, payload.password);
}

/**
 * Получает текущего customer из Medusa Store API.
 * GET /store/customers/me → { customer: MedusaCustomer }
 */
export async function getMedusaCustomer(token: string): Promise<MedusaCustomer> {
  const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
    headers: medusaStoreHeaders(token),
    cache: "no-store",
  });
  const json = (await res.json()) as { customer?: MedusaCustomer; message?: string };
  if (!res.ok) {
    throw new Error(json.message ?? "Failed to get customer");
  }
  if (!json.customer) throw new Error("No customer in response");
  return json.customer;
}

/**
 * Читает auth-токен из httpOnly cookie.
 */
export async function getAuthTokenFromCookie(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}

// ── Phase 3.4 additions ───────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = "vb_session";

/**
 * Читает значение Medusa session cookie (connect.sid).
 */
export async function getSessionCookieValue(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Обменивает JWT на Medusa stateful session (POST /auth/session).
 * Извлекает connect.sid из Set-Cookie заголовка ответа.
 * Возвращает undefined если Medusa не поддерживает сессии или ошибка.
 */
export async function exchangeJwtForSession(jwt: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${MEDUSA_URL}/auth/session`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const setCookie = res.headers.get("set-cookie") ?? "";
    const match = setCookie.match(/connect\.sid=([^;]+)/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

/**
 * Привязывает анонимную корзину к авторизованному customer (fire-and-forget).
 * POST /store/carts/:cartId с Bearer token → Medusa ассоциирует корзину с customer.
 */
export async function transferCartToCustomer(cartId: string, authToken: string): Promise<void> {
  await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
    method: "POST",
    headers: medusaStoreHeaders(authToken),
    body: JSON.stringify({}),
    cache: "no-store",
  });
}
