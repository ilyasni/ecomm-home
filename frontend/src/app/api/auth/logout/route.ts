import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/lib/auth/server";

const CLEAR_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", CLEAR_OPTS);
  response.cookies.set(SESSION_COOKIE_NAME, "", CLEAR_OPTS);
  return response;
}
