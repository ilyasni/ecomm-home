import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, registerWithStrapi } from "@/lib/auth/server";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as {
      username?: string;
      email?: string;
      password?: string;
    };
    if (!payload.username || !payload.email || !payload.password) {
      return NextResponse.json(
        { error: { message: "Заполни обязательные поля регистрации" } },
        { status: 400 }
      );
    }

    const result = await registerWithStrapi({
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });

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
      { error: { message: error instanceof Error ? error.message : "Ошибка регистрации" } },
      { status: 400 }
    );
  }
}
