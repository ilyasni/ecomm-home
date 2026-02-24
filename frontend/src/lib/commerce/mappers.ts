import type { Product } from "@/components/catalog/ProductCard";
import type { CommerceProductRef } from "@/lib/commerce/types";

export function mapProductToCommerceRef(product: Product): CommerceProductRef {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    image: product.image,
    price: product.price,
    oldPrice: product.oldPrice,
  };
}
