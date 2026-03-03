import { NextResponse } from "next/server";
import {
  getAuthTokenFromCookie,
  getMedusaCustomer,
  getSessionCookieValue,
} from "@/lib/auth/server";
import { getMedusaStoreHeaders } from "@/lib/medusa";

const MEDUSA_URL =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://medusa:9000";

// GET /api/account/profile — текущий customer из Medusa
export async function GET() {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const customer = await getMedusaCustomer(token);
    return NextResponse.json({ user: customer });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

interface ProfileUpdateBody {
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
}

// PATCH /api/account/profile — обновить profile в Medusa
export async function PATCH(req: Request) {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionValue = await getSessionCookieValue();
    const body = (await req.json()) as ProfileUpdateBody;

    const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      method: "POST",
      headers: getMedusaStoreHeaders({ sessionValue, authToken: token }),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      return NextResponse.json(
        { error: err.message ?? "Failed to update profile" },
        { status: res.status }
      );
    }

    const data = (await res.json()) as { customer: unknown };
    return NextResponse.json({ user: data.customer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
