"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { FiltersPanel } from "@/components/catalog/FiltersPanel";
import { addToCart, toggleFavorite } from "@/lib/commerce";
import { mapProductToCommerceRef } from "@/lib/commerce/mappers";
import type { Product } from "@/components/catalog/ProductCard";

interface SearchPageClientProps {
  query: string;
  products: Product[];
  activeFilters: Record<string, string[]>;
  totalCount: number;
  facetDistribution?: Record<string, Record<string, number>>;
}

export function SearchPageClient({
  query,
  products,
  activeFilters,
  totalCount,
  facetDistribution,
}: SearchPageClientProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const applyFilters = (values: Record<string, string[]>) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    for (const [key, vals] of Object.entries(values)) {
      vals.forEach((v) => params.append(key, v));
    }
    router.push(`/search?${params.toString()}`);
  };

  const removeFilter = (key: string, value: string) => {
    const next = { ...activeFilters };
    next[key] = (next[key] ?? []).filter((v) => v !== value);
    if (next[key].length === 0) delete next[key];
    applyFilters(next);
  };

  const clearAll = () => {
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const filterTags = Object.entries(activeFilters).flatMap(([key, vals]) =>
    vals.map((v) => ({
      id: `${key}:${v}`,
      label: v,
      onRemove: () => removeFilter(key, v),
    }))
  );

  const hasFilters = filterTags.length > 0;

  return (
    <>
      <CatalogFilters
        tags={filterTags}
        onClearAll={hasFilters ? clearAll : undefined}
        onOpenFilters={() => setIsFilterOpen(true)}
        className="mb-6"
      />

      {products.length === 0 ? (
        <p className="text-center text-[var(--color-dark)]">
          По запросу
          {query ? (
            <>
              {" "}
              «<strong>{query}</strong>»
            </>
          ) : null}{" "}
          {hasFilters ? "с выбранными фильтрами " : ""}ничего не найдено.{" "}
          {hasFilters ? (
            <button type="button" onClick={clearAll} className="underline">
              Сбросить фильтры
            </button>
          ) : (
            <Link href="/catalog" className="underline">
              Перейти в каталог
            </Link>
          )}
          .
        </p>
      ) : (
        <>
          <p className="mb-6 text-[var(--color-dark)]">
            Найдено: <strong>{totalCount}</strong>
          </p>
          <CatalogGrid
            products={products}
            columns={3}
            onAddToCart={(id) => {
              const p = products.find((item) => item.id === id);
              if (p) addToCart(mapProductToCommerceRef(p));
            }}
            onFavorite={(id) => {
              const p = products.find((item) => item.id === id);
              if (p) toggleFavorite(mapProductToCommerceRef(p));
            }}
          />
        </>
      )}

      <FiltersPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialValues={activeFilters}
        onApply={applyFilters}
        facetDistribution={facetDistribution}
      />
    </>
  );
}
