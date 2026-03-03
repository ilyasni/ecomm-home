import Image from "next/image";
import Link from "next/link";
import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Подарочные сертификаты — Vita Brava Home",
  description:
    "Подарочные сертификаты Vita Brava Home. Идеальный подарок из премиального домашнего текстиля.",
};

const features = [
  {
    title: "Любой номинал",
    text: "От 5 000 до 100 000 ₽ — выберите сумму под любой бюджет.",
  },
  {
    title: "Электронный или физический",
    text: "Отправим на e-mail получателя или оформим в красивом конверте.",
  },
  {
    title: "Действует 1 год",
    text: "Получатель не торопится — у него целый год на выбор.",
  },
  {
    title: "Любые товары",
    text: "Подходит для оплаты любых позиций каталога Vita Brava Home.",
  },
];

const faq = [
  {
    q: "Как заказать сертификат?",
    a: "Оформите электронный сертификат прямо на сайте или свяжитесь с нами — поможем выбрать.",
  },
  {
    q: "Можно ли использовать частично?",
    a: "Да, остаток суммы сохраняется на счету и действует до окончания срока.",
  },
  {
    q: "Где получить физический сертификат?",
    a: "В любом из наших бутиков или с доставкой по Москве.",
  },
];

export default function GiftCertificatesPage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />

      <main className="desktop:pt-[160px] pt-[120px] md:pt-[140px]">
        {/* Hero-блок */}
        <section className="relative overflow-hidden bg-[var(--color-gold)]">
          <div className="desktop:px-0 desktop:py-0 desktop:h-[500px] mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-10 md:flex-row md:items-stretch md:px-[39px]">
            <div className="desktop:w-[620px] relative h-[260px] w-full overflow-hidden md:h-auto md:w-1/2 md:shrink-0">
              <Image
                src="/assets/figma/placeholder.svg"
                alt="Подарочные сертификаты Vita Brava Home"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="flex items-center py-4">
              <div className="flex max-w-[480px] flex-col gap-6">
                <h1 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium">
                  Подарок, которому будет рад каждый
                </h1>
                <p className="desktop:text-base max-w-[400px] text-sm leading-[1.5] text-[var(--color-dark)]">
                  Не знаете, что подарить? Наш подарочный сертификат позволит близкому самому
                  выбрать что-то особенное из коллекции Vita Brava Home.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/catalog/gift-certificates"
                    className="inline-flex items-center justify-center rounded-[5px] bg-[var(--color-black)] px-8 py-3 text-sm font-medium text-[var(--color-light)] transition-opacity hover:opacity-80"
                  >
                    Выбрать сертификат
                  </Link>
                  <Link
                    href="/boutiques"
                    className="inline-flex items-center justify-center rounded-[5px] border border-[var(--color-black)] px-8 py-3 text-sm font-medium transition-opacity hover:opacity-80"
                  >
                    Найти в бутике
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section className="desktop:px-0 desktop:py-20 mx-auto max-w-[1400px] px-4 py-16 md:px-[39px]">
          <h2 className="desktop:text-[32px] text-center text-[22px] leading-[1.1] font-medium md:text-[28px]">
            Почему выбирают наши сертификаты
          </h2>
          <div className="desktop:grid-cols-4 mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-3 border border-[var(--color-gray-light)] p-6"
              >
                <h3 className="text-base leading-[1.2] font-medium">{f.title}</h3>
                <p className="text-sm leading-[1.5] text-[var(--color-dark)]">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--color-gray-light)]">
          <div className="desktop:px-0 desktop:py-20 mx-auto max-w-[1400px] px-4 py-16 md:px-[39px]">
            <h2 className="desktop:text-[32px] text-[22px] leading-[1.1] font-medium md:text-[28px]">
              Часто задаваемые вопросы
            </h2>
            <div className="mt-8 flex flex-col divide-y divide-[var(--color-gray-light)]">
              {faq.map((item) => (
                <div key={item.q} className="py-6">
                  <p className="text-base leading-[1.3] font-medium">{item.q}</p>
                  <p className="mt-3 text-sm leading-[1.5] text-[var(--color-dark)]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--color-selection)]">
          <div className="desktop:px-0 desktop:py-20 mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-4 py-16 text-center md:px-[39px]">
            <h2 className="text-[22px] leading-[1.1] font-medium md:text-[28px]">
              Остались вопросы?
            </h2>
            <p className="max-w-[480px] text-sm leading-[1.5] text-[var(--color-dark)]">
              Позвоните нам или напишите — поможем выбрать сертификат и оформим доставку.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center rounded-[5px] bg-[var(--color-brand)] px-8 py-3 text-sm font-medium text-[var(--color-light)] transition-opacity hover:opacity-80"
              >
                Связаться с нами
              </Link>
              <Link
                href="/catalog/gift-certificates"
                className="inline-flex items-center justify-center rounded-[5px] border border-[var(--color-brand)] px-8 py-3 text-sm font-medium text-[var(--color-brand)] transition-opacity hover:opacity-80"
              >
                Перейти в каталог
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterServer />
    </div>
  );
}
