"use client";

type SeoTextProps = {
  className?: string;
};

export function SeoText({ className }: SeoTextProps) {
  return (
    <section className={`bg-[var(--background)] px-4 md:px-[39px] desktop:px-0 ${className || ""}`}>
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 desktop:gap-10">
        <p className="text-sm leading-relaxed text-[var(--color-gray)]">
          Подушки — это не просто декор, а&nbsp;часть вашего ежедневного комфорта.
          В&nbsp;нашем интернет-магазине вы&nbsp;найдёте подушки из&nbsp;натуральных материалов —
          от&nbsp;шёлка и&nbsp;бамбука до&nbsp;пуховых моделей премиального уровня.
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-gray)]">
          Каждая подушка из&nbsp;нашего каталога создана для&nbsp;полноценного
          отдыха и&nbsp;здорового сна. Благодаря высокому качеству материалов
          и&nbsp;продуманной конструкции наши подушки обеспечивают правильную
          поддержку шеи и&nbsp;головы.
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-gray)]">
          Мы&nbsp;предлагаем продукцию из&nbsp;натурального сырья, от&nbsp;надёжных
          производителей. Сертификаты качества подтверждают безопасность
          и&nbsp;гипоаллергенность изделий. Доставка по&nbsp;всей России.
        </p>
      </div>
    </section>
  );
}
