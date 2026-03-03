import { NextResponse } from "next/server";
import { strapiPost } from "@/lib/strapi";
import { sendEmail, orderRequestAdminHtml, EMAIL_ADMIN } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      comment?: string;
      variant?: string;
    };
    const { name, phone, email, comment, variant } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
    }

    const resolvedVariant = variant === "consultation" ? "consultation" : "order";

    try {
      await strapiPost("/order-inquiries", {
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() ?? "",
          comment: comment?.trim() ?? "",
          variant: resolvedVariant,
        },
      });
    } catch (err) {
      console.error(
        "[api/order-request] Strapi save failed:",
        err instanceof Error ? err.message : err
      );
    }

    if (EMAIL_ADMIN) {
      void sendEmail({
        to: EMAIL_ADMIN,
        subject:
          resolvedVariant === "consultation"
            ? "Vita Brava Home — запрос консультации"
            : "Vita Brava Home — заявка на заказ товара",
        html: orderRequestAdminHtml({
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() ?? "",
          variant: resolvedVariant,
          comment: comment?.trim() ?? "",
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка обработки запроса" }, { status: 500 });
  }
}
