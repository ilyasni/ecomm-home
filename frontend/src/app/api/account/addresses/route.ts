import { NextResponse } from "next/server";
import {
  getAuthTokenFromCookie,
  getMedusaCustomer,
  getSessionCookieValue,
} from "@/lib/auth/server";
import { getMedusaStoreHeaders } from "@/lib/medusa";

const MEDUSA_URL =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://medusa:9000";

// GET /api/account/addresses — адреса из customer.addresses
export async function GET() {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ addresses: [] });
    }
    const customer = await getMedusaCustomer(token);
    return NextResponse.json({ addresses: customer.addresses ?? [] });
  } catch {
    return NextResponse.json({ addresses: [] });
  }
}

interface AddressBody {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country_code?: string;
  phone?: string;
  company?: string;
}

// POST /api/account/addresses — добавить адрес
export async function POST(req: Request) {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionValue = await getSessionCookieValue();
    const body = (await req.json()) as AddressBody;

    const res = await fetch(`${MEDUSA_URL}/store/customers/me/addresses`, {
      method: "POST",
      headers: getMedusaStoreHeaders({ sessionValue, authToken: token }),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      return NextResponse.json(
        { error: err.message ?? "Failed to add address" },
        { status: res.status }
      );
    }

    const data = (await res.json()) as { customer: { addresses: unknown[] } };
    return NextResponse.json({ addresses: data.customer.addresses ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
