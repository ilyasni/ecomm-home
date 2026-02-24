import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, loginWithStrapi } from "@/lib/auth/server";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as { identifier?: string; password?: string };
    if (!payload.identifier || !payload.password) {
      return NextResponse.json(
        { error: { message: "Неверные данные для входа" } },
        { status: 400 }
      );
    }

    const result = await loginWithStrapi(payload.identifier, payload.password);
    const response = NextResponse.json({ user: result.user });
    response.cookies.set(AUTH_COOKIE_NAME, result.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Ошибка входа" } },
      { status: 401 }
    );
  }
}
