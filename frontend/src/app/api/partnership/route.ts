import { NextResponse } from "next/server";
import { strapiPost } from "@/lib/strapi";
import { sendEmail, partnershipAdminHtml, EMAIL_ADMIN } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      city?: string;
    };
    const { name, phone, email, city } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
    }

    try {
      await strapiPost("/partnership-inquiries", {
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() ?? "",
          city: city?.trim() ?? "",
        },
      });
    } catch (err) {
      console.error(
        "[api/partnership] Strapi save failed:",
        err instanceof Error ? err.message : err
      );
    }

    if (EMAIL_ADMIN) {
      void sendEmail({
        to: EMAIL_ADMIN,
        subject: "Vita Brava Home — заявка на сотрудничество",
        html: partnershipAdminHtml({
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() ?? "",
          city: city?.trim() ?? "",
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка обработки запроса" }, { status: 500 });
  }
}
