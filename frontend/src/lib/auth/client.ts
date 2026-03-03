export interface AuthUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company_name: string | null;
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(
      (data as { error?: { message?: string } }).error?.message ?? "Auth request failed"
    );
  }
  return data;
}

export async function login(payload: { identifier: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<{ user: AuthUser }>(res);
}

export async function register(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<{ user: AuthUser }>(res);
}

export async function logout() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  return parseJson<{ ok: true }>(res);
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (res.status === 401) return null;
  return parseJson<{ user: AuthUser }>(res);
}
