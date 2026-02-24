"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { successOrderMock, recommendedProducts } from "@/data/account";
import { getCommerceSnapshot } from "@/lib/commerce";

function ThankYouBanner() {
  return (
    <div className="mb-6 rounded-[5px] bg-[var(--color-beige)] p-6 text-center md:mb-8 md:p-10">
      <div className="mb-3 flex justify-center">
        <Icon name="checkCircle" size={40} />
      </div>
      <h1 className="mb-2 text-[24px] leading-[1.2] font-medium md:text-[32px]">
        Спасибо за заказ!
      </h1>
      <p className="mx-auto max-w-[500px] text-[14px] text-[var(--color-dark)] md:text-[16px]">
        Мы уже начали его обрабатывать. Вы получите уведомление, когда заказ будет готов.
      </p>
    </div>
  );
}

function OrderSummary() {
  const searchParams = useSearchParams();
  const order = useMemo(() => {
    const orderId = searchParams.get("orderId");
    if (!orderId) return successOrderMock;
    const stored = getCommerceSnapshot().orders.find((item) => item.id === orderId);
    if (!stored) return successOrderMock;
    return {
      orderNumber: stored.id,
      total: stored.total,
      paymentLabel: stored.paymentMethod,
      status: `Заказ №${stored.id} поступил в обработку`,
      statusDescription: "Ваш заказ принят и передан на сборку.",
      deliveryAddress: stored.deliveryAddress,
      deliveryDate: "Срок уточняется",
      recipient: stored.customerName,
      recipientPhone: stored.phone,
      products: stored.items.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
      })),
    };
  }, [searchParams]);

  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-16 md:flex-row md:gap-8">
      {/* Детали заказа */}
      <div className="min-w-0 flex-1">
        <Link
          href="/catalog"
          className="mb-4 inline-flex items-center gap-2 text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)]"
        >
          <Icon name="arrowRight" size={14} className="rotate-180" />
          Продолжить покупки
        </Link>

        {/* Сумма */}
        <div className="mb-4 rounded-[5px] border border-[var(--color-gray-light)] p-4 md:p-6">
          <p className="text-[20px] font-medium md:text-[22px]">{order.total}</p>
          <p className="mt-1 text-[14px] text-[var(--color-dark)]">{order.paymentLabel}</p>
        </div>

        {/* Статус */}
        <div className="mb-4 rounded-[5px] border border-[var(--color-gray-light)] p-4 md:p-6">
          <p className="text-[16px] font-medium">{order.status}</p>
          <p className="mt-2 text-[14px] leading-[1.5] text-[var(--color-dark)]">
            {order.statusDescription}
          </p>
        </div>

        {/* Информация о доставке */}
        <div className="mb-4 rounded-[5px] border border-[var(--color-gray-light)] p-4 md:p-6">
          <h3 className="mb-3 text-[16px] font-medium">Информация о доставке</h3>
          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[var(--color-dark)]">Адрес</span>
              <span className="max-w-[60%] text-right">{order.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-dark)]">Дата доставки</span>
              <span>{order.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-dark)]">Получатель</span>
              <span>{order.recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-dark)]">Телефон</span>
              <span>{order.recipientPhone}</span>
            </div>
          </div>
        </div>

        {/* Состав заказа */}
        <div className="rounded-[5px] border border-[var(--color-gray-light)] p-4 md:p-6">
          <h3 className="mb-1 text-[16px] font-medium">Состав заказа</h3>
          <p className="mb-3 text-[14px] text-[var(--color-dark)]">
            {order.products.length} товар(а)
          </p>
          <div className="flex gap-2 overflow-x-auto">
            {order.products.map((product) => (
              <div key={product.id} className="shrink-0">
                <div className="relative h-[80px] w-[80px] overflow-hidden rounded bg-[var(--color-beige)]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="mt-1 text-center text-[11px] text-[var(--color-dark)]">
                  {product.quantity} шт.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Боковая панель — кнопки */}
      <aside className="h-fit w-full shrink-0 rounded-[5px] border border-[var(--color-gray-light)] p-4 md:w-[447px] md:p-6">
        <p className="mb-4 text-[14px] text-[var(--color-dark)]">
          Детали заказа отправлены на вашу почту. Отследить статус можно в{" "}
          <Link href="/account/orders" className="font-medium text-[var(--color-black)] underline">
            личном кабинете
          </Link>
          .
        </p>
        <Link href="/account/orders">
          <Button variant="secondary" fullWidth className="mb-3">
            Мои заказы
          </Button>
        </Link>
        <Link href="/catalog">
          <Button variant="primary" fullWidth>
            Продолжить покупки
          </Button>
        </Link>
      </aside>
    </div>
  );
}

function RecommendationsSection() {
  if (recommendedProducts.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-medium md:text-[28px]">Рекомендуем</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] hover:bg-[var(--color-beige)]"
            aria-label="Назад"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] hover:bg-[var(--color-beige)]"
            aria-label="Вперёд"
          >
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              image: product.image,
              badge: product.badge,
            }}
            variant="medium"
          />
        ))}
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-12 md:px-[39px] md:pb-20">
          <ThankYouBanner />
          <OrderSummary />
          <RecommendationsSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
