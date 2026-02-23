"use client";

import { ProductCard, type Product } from "@/components/catalog/ProductCard";

type CollectionProductsProps = {
  products: Product[];
};

export function CollectionProducts({ products }: CollectionProductsProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 md:py-12 desktop:py-20">
      <h2 className="text-center text-[22px] md:text-[28px] desktop:text-[32px] font-medium leading-[1.1] text-[var(--color-foreground)]">
        Товары коллекции
      </h2>
      <div className="mt-6 md:mt-8 desktop:mt-10 grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-2 desktop:gap-[8px]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="large" />
        ))}
      </div>
    </section>
  );
}
