import Image from "next/image";
import { promotionProducts } from "@/data/account";

export function PromotionSection() {
  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="flex items-center gap-6 rounded-[5px] border border-[var(--color-gray-light)] p-6">
        <div className="hidden h-[170px] w-[170px] shrink-0 items-center justify-center rounded-full bg-[var(--color-selection)] md:flex">
          <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
            <rect width="76" height="76" rx="8" fill="var(--color-gold)" fillOpacity="0.2" />
            <path
              d="M38 18L42 30H54L44 38L48 50L38 42L28 50L32 38L22 30H34L38 18Z"
              fill="var(--color-gold)"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-medium text-[var(--color-black)]">
            Акция «Баллы за отзывы»
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[var(--color-brand)] px-4 py-1.5 text-xs text-[var(--color-light)]">
              50 баллов за текстовый отзыв
            </span>
            <span className="rounded-full bg-[var(--color-selection)] px-4 py-1.5 text-xs text-[var(--color-dark-gray)]">
              100 баллов за видео отзыв
            </span>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div>
        <p className="text-base font-medium text-[var(--color-black)]">Нет подходящих товаров</p>
        <p className="mt-2 text-sm text-[var(--color-dark-gray)]">
          У вас нет покупок, участвующих в акции. Сообщим, когда они появятся
        </p>
      </div>

      {/* Other promotion products */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-[var(--color-black)]">
          Другие товары в акции
        </h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {promotionProducts.map((product) => (
            <div key={product.id} className="flex flex-col gap-2">
              <div className="relative aspect-[294/300] overflow-hidden rounded-[5px] bg-[var(--color-selection)]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  unoptimized
                  className="h-full w-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 rounded bg-[var(--color-brand)] px-2 py-0.5 text-xs text-[var(--color-light)]">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="line-clamp-2 text-sm font-medium text-[var(--color-black)]">
                  {product.title}
                </span>
                <span className="line-clamp-2 text-xs text-[var(--color-gray)]">
                  {product.description}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-black)]">
                    {product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xs text-[var(--color-gray)] line-through">
                      {product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
