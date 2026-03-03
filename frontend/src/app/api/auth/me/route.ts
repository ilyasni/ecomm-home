import { NextResponse } from "next/server";
import { getAuthTokenFromCookie, getMedusaCustomer } from "@/lib/auth/server";

export async function GET() {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }
    const customer = await getMedusaCustomer(token);
    return NextResponse.json({ user: customer });
  } catch {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }
}
