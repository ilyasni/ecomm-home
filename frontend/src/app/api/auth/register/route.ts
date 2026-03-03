import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  registerWithMedusa,
  getMedusaCustomer,
  exchangeJwtForSession,
  transferCartToCustomer,
} from "@/lib/auth/server";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as {
      first_name?: string;
      last_name?: string;
      email?: string;
      password?: string;
    };
    if (!payload.email || !payload.password) {
      return NextResponse.json(
        { error: { message: "Заполни обязательные поля регистрации" } },
        { status: 400 }
      );
    }

    const token = await registerWithMedusa({
      first_name: payload.first_name ?? "",
      last_name: payload.last_name ?? "",
      email: payload.email,
      password: payload.password,
    });
    const customer = await getMedusaCustomer(token);

    const response = NextResponse.json({ user: customer });
    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTS);

    // 3.4.3 — обменять JWT на Medusa session (graceful)
    const sessionValue = await exchangeJwtForSession(token);
    if (sessionValue) {
      response.cookies.set(SESSION_COOKIE_NAME, sessionValue, COOKIE_OPTS);
    }

    // 3.4.1 — привязать анонимную корзину к customer (fire-and-forget)
    const cookieStore = await cookies();
    const cartId = cookieStore.get("medusa_cart_id")?.value;
    if (cartId) {
      void transferCartToCustomer(cartId, token).catch(() => {});
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Ошибка регистрации" } },
      { status: 400 }
    );
  }
}
