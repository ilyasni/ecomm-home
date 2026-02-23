"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ClearCartModal } from "@/components/checkout/modals/ClearCartModal";
import { favoriteProducts as initialFavorites, recentlyViewed } from "@/data/account";

type SortOption = "default" | "price-asc" | "price-desc";

type FavoriteProduct = (typeof initialFavorites)[number];

function RecentlyViewedSection() {
  if (recentlyViewed.length === 0) return null;

  return (
    <section className="mt-10 md:mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] md:text-[28px] font-medium">Ранее вы смотрели</h2>
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
        {recentlyViewed.map((product) => (
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

function EmptyFavorites() {
  return (
    <>
      <div className="bg-[var(--color-beige)] rounded-[5px] py-6 px-4 text-center mb-6">
        <p className="text-[14px] md:text-[16px] leading-[1.5]">
          Вы ещё не добавили ни одного товара в избранное.
          <br className="hidden md:block" />
          Посмотрите наши{" "}
          <Link href="/catalog" className="font-medium underline">
            новинки
          </Link>{" "}
          или воспользуйтесь{" "}
          <Link href="/catalog" className="font-medium underline">
            поиском
          </Link>
          .
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <Link href="/catalog">
          <Button variant="primary">Перейти в каталог</Button>
        </Link>
      </div>

      <RecentlyViewedSection />
    </>
  );
}

function FavoritesGrid({
  products,
  onClearAll,
}: {
  products: FavoriteProduct[];
  onClearAll: () => void;
}) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-asc") {
      const pa = parseInt(a.price.replace(/\D/g, ""));
      const pb = parseInt(b.price.replace(/\D/g, ""));
      return pa - pb;
    }
    if (sort === "price-desc") {
      const pa = parseInt(a.price.replace(/\D/g, ""));
      const pb = parseInt(b.price.replace(/\D/g, ""));
      return pb - pa;
    }
    return 0;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() =>
            setSort((prev) =>
              prev === "default"
                ? "price-asc"
                : prev === "price-asc"
                ? "price-desc"
                : "default"
            )
          }
          className="flex items-center gap-1.5 text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)]"
        >
          Сортировка
          <Icon name="arrowDown" size={14} />
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)]"
        >
          Удалить все
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-6 mb-12">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              oldPrice: product.oldPrice,
              image: product.image,
              badge: product.badge,
              colors: product.colors,
            }}
            variant="large"
          />
        ))}
      </div>

      <RecentlyViewedSection />
    </>
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(initialFavorites);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const isEmpty = favorites.length === 0;

  const handleClearAll = () => {
    setFavorites([]);
    setClearModalOpen(false);
  };

  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 pb-12 md:pb-20">
          <h1 className="text-center text-[28px] md:text-[36px] font-medium leading-[1.2] mb-6 md:mb-8">
            Избранное{" "}
            <span className="text-[16px] md:text-[18px] font-normal text-[var(--color-dark)]">
              ({favorites.length})
            </span>
          </h1>

          {isEmpty ? (
            <EmptyFavorites />
          ) : (
            <FavoritesGrid
              products={favorites}
              onClearAll={() => setClearModalOpen(true)}
            />
          )}
        </div>
      </main>

      <Footer />

      <ClearCartModal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearAll}
      />
    </>
  );
}
