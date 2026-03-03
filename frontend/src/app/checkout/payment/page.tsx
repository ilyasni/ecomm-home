"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/design-system/components";
import { Icon } from "@/design-system/icons";

const METHOD_LABELS: Record<string, string> = {
  card: "Оплата картой онлайн",
  sbp: "СБП",
  "yandex-pay": "Yandex Pay / SberPay",
};

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") ?? "";
  const paymentId = searchParams.get("paymentId") ?? "";
  const encodedUrl = searchParams.get("url") ?? "";
  const method = searchParams.get("method") ?? "card";

  const confirmationUrl = encodedUrl ? decodeURIComponent(encodedUrl) : "";
  const isStub = !confirmationUrl || confirmationUrl === "stub";

  const isRedirecting = !isStub && !!confirmationUrl;

  // Авто-редирект если пришёл реальный URL от YooKassa
  useEffect(() => {
    if (isRedirecting) {
      window.location.href = confirmationUrl!;
    }
  }, [isRedirecting, confirmationUrl]);

  function handleSimulateSuccess() {
    router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
  }

  function handleOpenPayment() {
    if (confirmationUrl && confirmationUrl !== "stub") {
      window.location.href = confirmationUrl;
    }
  }

  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[800px] px-4 pb-20 md:px-[39px]">
          {/* Хлебная крошка */}
          <Link
            href="/checkout"
            className="mb-6 inline-flex items-center gap-2 text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)]"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" />
            Вернуться к оформлению
          </Link>

          {/* Заголовок */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-[28px] leading-[1.2] font-medium md:text-[36px]">
              Оплата заказа
            </h1>
            {orderId && <p className="text-[14px] text-[var(--color-dark)]">Заказ №{orderId}</p>}
          </div>

          {/* Карточка оплаты */}
          <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6 md:p-10">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-beige)]">
                <Icon name="bagCard" size={32} />
              </div>
            </div>

            <h2 className="mb-2 text-center text-[20px] font-medium">
              {METHOD_LABELS[method] ?? "Онлайн-оплата"}
            </h2>

            {isStub ? (
              // ── Stub-режим ─────────────────────────────────────────────────
              <>
                <p className="mb-6 text-center text-[14px] leading-[1.6] text-[var(--color-dark)]">
                  Тестовый режим оплаты. Нажмите кнопку ниже, чтобы симулировать успешную оплату и
                  перейти к странице подтверждения заказа.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="primary" fullWidth onClick={handleSimulateSuccess}>
                    Симулировать успешную оплату
                  </Button>
                  <p className="text-center text-[12px] text-[var(--color-dark)]">
                    Stub-режим активен. Настройте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY для
                    подключения реальных платежей.
                  </p>
                </div>
              </>
            ) : isRedirecting ? (
              // ── Реальный redirect ──────────────────────────────────────────
              <>
                <p className="mb-6 text-center text-[14px] leading-[1.6] text-[var(--color-dark)]">
                  Перенаправляем вас на страницу оплаты YooKassa...
                </p>
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-gold)] border-t-transparent" />
                </div>
              </>
            ) : (
              // ── Кнопка ручного перехода (fallback) ────────────────────────
              <>
                <p className="mb-6 text-center text-[14px] leading-[1.6] text-[var(--color-dark)]">
                  Нажмите кнопку ниже, чтобы перейти на страницу безопасной оплаты.
                </p>
                <Button variant="primary" fullWidth onClick={handleOpenPayment}>
                  Перейти к оплате
                </Button>
              </>
            )}

            {/* Метаданные */}
            {paymentId && (
              <p className="mt-4 text-center text-[12px] text-[var(--color-dark)]">
                ID платежа: {paymentId}
              </p>
            )}
          </div>

          {/* Гарантии */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-[13px] text-[var(--color-dark)]">
            <span className="flex items-center gap-1.5">
              <Icon name="checkCircle" size={14} />
              Безопасная оплата
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="checkCircle" size={14} />
              Данные защищены
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="checkCircle" size={14} />
              Возврат в течение 14 дней
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
