"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ClearCartModal } from "@/components/checkout/modals/ClearCartModal";
import { recentlyViewed } from "@/data/account";
import {
  clearFavorites,
  getCommerceSnapshot,
  subscribeCommerce,
  toggleFavorite,
} from "@/lib/commerce";
import type { CommerceProductRef } from "@/lib/commerce";

type SortOption = "default" | "price-asc" | "price-desc";

type FavoriteProduct = CommerceProductRef;

function RecentlyViewedSection() {
  if (recentlyViewed.length === 0) return null;

  return (
    <section className="mt-10 md:mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-medium md:text-[28px]">Ранее вы смотрели</h2>
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
      <div className="mb-6 rounded-[5px] bg-[var(--color-beige)] px-4 py-6 text-center">
        <p className="text-[14px] leading-[1.5] md:text-[16px]">
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

      <div className="mb-10 flex justify-center">
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
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setSort((prev) =>
              prev === "default" ? "price-asc" : prev === "price-asc" ? "price-desc" : "default"
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

      <div className="desktop:grid-cols-3 mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
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
            }}
            variant="large"
            onFavorite={() => toggleFavorite(product)}
          />
        ))}
      </div>

      <RecentlyViewedSection />
    </>
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setFavorites(getCommerceSnapshot().favorites);
    };
    sync();
    return subscribeCommerce(sync);
  }, []);

  const isEmpty = favorites.length === 0;

  const handleClearAll = () => {
    clearFavorites();
    setClearModalOpen(false);
  };

  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-12 md:px-[39px] md:pb-20">
          <h1 className="mb-6 text-center text-[28px] leading-[1.2] font-medium md:mb-8 md:text-[36px]">
            Избранное{" "}
            <span className="text-[16px] font-normal text-[var(--color-dark)] md:text-[18px]">
              ({favorites.length})
            </span>
          </h1>

          {isEmpty ? (
            <EmptyFavorites />
          ) : (
            <FavoritesGrid products={favorites} onClearAll={() => setClearModalOpen(true)} />
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
