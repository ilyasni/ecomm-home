import { NextResponse } from "next/server";
import { strapiPost } from "@/lib/strapi";
import { sendEmail, contactAdminHtml, EMAIL_ADMIN } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; phone?: string; message?: string };
    const { name, phone, message } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Имя обязательно" }, { status: 400 });
    }

    try {
      await strapiPost("/contact-inquiries", {
        data: {
          name: name.trim(),
          phone: phone?.trim() ?? "",
          message: message?.trim() ?? "",
        },
      });
    } catch (err) {
      console.error("[api/contact] Strapi save failed:", err instanceof Error ? err.message : err);
    }

    if (EMAIL_ADMIN) {
      void sendEmail({
        to: EMAIL_ADMIN,
        subject: "Vita Brava Home — новое сообщение с сайта",
        html: contactAdminHtml({
          name: name.trim(),
          phone: phone?.trim() ?? "",
          message: message?.trim() ?? "",
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка обработки запроса" }, { status: 500 });
  }
}
