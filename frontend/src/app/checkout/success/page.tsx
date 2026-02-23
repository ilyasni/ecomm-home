"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { successOrderMock, recommendedProducts } from "@/data/account";

function ThankYouBanner() {
  return (
    <div className="bg-[var(--color-beige)] rounded-[5px] p-6 md:p-10 text-center mb-6 md:mb-8">
      <div className="flex justify-center mb-3">
        <Icon name="checkCircle" size={40} />
      </div>
      <h1 className="text-[24px] md:text-[32px] font-medium leading-[1.2] mb-2">
        Спасибо за заказ!
      </h1>
      <p className="text-[14px] md:text-[16px] text-[var(--color-dark)] max-w-[500px] mx-auto">
        Мы уже начали его обрабатывать. Вы получите уведомление, когда заказ будет готов.
      </p>
    </div>
  );
}

function OrderSummary() {
  const order = successOrderMock;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10 md:mb-16">
      {/* Детали заказа */}
      <div className="flex-1 min-w-0">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)] mb-4"
        >
          <Icon name="arrowRight" size={14} className="rotate-180" />
          Продолжить покупки
        </Link>

        {/* Сумма */}
        <div className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6 mb-4">
          <p className="text-[20px] md:text-[22px] font-medium">{order.total}</p>
          <p className="text-[14px] text-[var(--color-dark)] mt-1">{order.paymentLabel}</p>
        </div>

        {/* Статус */}
        <div className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6 mb-4">
          <p className="text-[16px] font-medium">{order.status}</p>
          <p className="text-[14px] text-[var(--color-dark)] mt-2 leading-[1.5]">
            {order.statusDescription}
          </p>
        </div>

        {/* Информация о доставке */}
        <div className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6 mb-4">
          <h3 className="text-[16px] font-medium mb-3">Информация о доставке</h3>
          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[var(--color-dark)]">Адрес</span>
              <span className="text-right max-w-[60%]">{order.deliveryAddress}</span>
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
        <div className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6">
          <h3 className="text-[16px] font-medium mb-1">Состав заказа</h3>
          <p className="text-[14px] text-[var(--color-dark)] mb-3">
            {order.products.length} товар(а)
          </p>
          <div className="flex gap-2 overflow-x-auto">
            {order.products.map((product) => (
              <div key={product.id} className="shrink-0">
                <div className="w-[80px] h-[80px] relative rounded overflow-hidden bg-[var(--color-beige)]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="text-[11px] text-[var(--color-dark)] mt-1 text-center">
                  {product.quantity} шт.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Боковая панель — кнопки */}
      <aside className="w-full md:w-[447px] shrink-0 border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6 h-fit">
        <p className="text-[14px] text-[var(--color-dark)] mb-4">
          Детали заказа отправлены на вашу почту. Отследить статус можно в{" "}
          <Link href="/account/orders" className="underline font-medium text-[var(--color-black)]">
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] md:text-[28px] font-medium">Рекомендуем</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-[var(--color-gray-light)] flex items-center justify-center hover:bg-[var(--color-beige)]"
            aria-label="Назад"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-[var(--color-gray-light)] flex items-center justify-center hover:bg-[var(--color-beige)]"
            aria-label="Вперёд"
          >
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 pb-12 md:pb-20">
          <ThankYouBanner />
          <OrderSummary />
          <RecommendationsSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
