/**
 * POST /api/email/order-confirmation
 *
 * Отправляет письмо с подтверждением заказа покупателю.
 * Вызывается из checkout/page.tsx fire-and-forget после получения orderId.
 */

import { NextResponse } from "next/server";
import { sendEmail, orderConfirmationHtml } from "@/lib/email";
import type { OrderItem, OrderConfirmationEmailData } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<OrderConfirmationEmailData> & {
      customerEmail?: string;
    };

    const {
      customerEmail,
      orderId,
      customerName,
      deliveryAddress,
      items,
      subtotal,
      total,
      promoDiscount,
      bonusDiscount,
      deliveryPrice,
    } = body;

    if (!customerEmail || !orderId || !total) {
      return NextResponse.json(
        { error: "Обязательные поля: customerEmail, orderId, total" },
        { status: 400 }
      );
    }

    void sendEmail({
      to: customerEmail,
      subject: `Ваш заказ #${orderId} принят — Vita Brava Home`,
      html: orderConfirmationHtml({
        orderId: orderId,
        customerName: customerName ?? "",
        deliveryAddress: deliveryAddress ?? "",
        items: (items ?? []) as OrderItem[],
        subtotal: subtotal ?? total,
        total: total,
        promoDiscount,
        bonusDiscount,
        deliveryPrice: deliveryPrice ?? "—",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка обработки запроса" }, { status: 500 });
  }
}
