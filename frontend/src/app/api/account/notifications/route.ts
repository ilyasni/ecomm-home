import { NextResponse } from "next/server";
import {
  getAuthTokenFromCookie,
  getMedusaCustomer,
  getSessionCookieValue,
} from "@/lib/auth/server";
import { getMedusaStoreHeaders } from "@/lib/medusa";

const MEDUSA_URL =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://medusa:9000";

interface NotificationSettingPayload {
  id: string;
  email: boolean;
  sms: boolean;
}

// GET /api/account/notifications — текущие настройки из Medusa customer metadata
export async function GET() {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const customer = await getMedusaCustomer(token);
    const saved = customer?.metadata?.notification_settings;
    return NextResponse.json({ settings: saved ?? null });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// PATCH /api/account/notifications — сохранить настройки в Medusa customer metadata
export async function PATCH(req: Request) {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { settings?: NotificationSettingPayload[] };
    if (!Array.isArray(body.settings)) {
      return NextResponse.json({ error: "settings array required" }, { status: 400 });
    }

    const sessionValue = await getSessionCookieValue();
    const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      method: "POST",
      headers: getMedusaStoreHeaders({ sessionValue, authToken: token }),
      body: JSON.stringify({ metadata: { notification_settings: body.settings } }),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      return NextResponse.json(
        { error: err.message ?? "Failed to save notifications" },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
