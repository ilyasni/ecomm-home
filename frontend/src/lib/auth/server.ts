import { cookies } from "next/headers";

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export const AUTH_COOKIE_NAME = "vb_auth_token";

async function strapiAuthRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${STRAPI_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const json = (await response.json()) as T & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(json.error?.message ?? "Auth API request failed");
  }

  return json;
}

export async function loginWithStrapi(identifier: string, password: string) {
  return strapiAuthRequest<{ jwt: string; user: { id: number; username: string; email: string } }>(
    "/auth/local",
    {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }
  );
}

export async function registerWithStrapi(payload: {
  username: string;
  email: string;
  password: string;
}) {
  return strapiAuthRequest<{ jwt: string; user: { id: number; username: string; email: string } }>(
    "/auth/local/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getMeFromStrapi(token: string) {
  return strapiAuthRequest<{ id: number; username: string; email: string }>("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAuthTokenFromCookie() {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}
