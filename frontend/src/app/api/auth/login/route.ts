import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  loginWithMedusa,
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
    const payload = (await req.json()) as { identifier?: string; password?: string };
    if (!payload.identifier || !payload.password) {
      return NextResponse.json(
        { error: { message: "Неверные данные для входа" } },
        { status: 400 }
      );
    }

    const token = await loginWithMedusa(payload.identifier, payload.password);
    const customer = await getMedusaCustomer(token);

    const response = NextResponse.json({ user: customer });
    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTS);

    // 3.4.3 — обменять JWT на Medusa session (graceful, не блокирует логин)
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
      { error: { message: error instanceof Error ? error.message : "Ошибка входа" } },
      { status: 401 }
    );
  }
}
