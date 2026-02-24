import { NextResponse } from "next/server";
import { getAuthTokenFromCookie, getMeFromStrapi } from "@/lib/auth/server";

export async function GET() {
  try {
    const token = await getAuthTokenFromCookie();
    if (!token) {
      return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }
    const user = await getMeFromStrapi(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }
}
