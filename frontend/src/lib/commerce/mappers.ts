import type { Product } from "@/components/catalog/ProductCard";
import type { MedusaProduct, MedusaLineItem } from "@/lib/medusa";
import type { CommerceCartItem, CommerceProductRef } from "@/lib/commerce/types";

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

function formatRub(amount: number, currencyCode: string): string {
  if (currencyCode === "rub") {
    return `${Math.round(amount).toLocaleString("ru-RU")} \u20BD`;
  }
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount);
}

export function mapMedusaProductToCommerceRef(
  product: MedusaProduct,
  currencyCode = "rub"
): CommerceProductRef {
  const variant = product.variants[0];
  const priceData = variant?.calculated_price;
  const price = priceData
    ? formatRub(priceData.calculated_amount / 100, currencyCode)
    : "По запросу";
  const oldPrice =
    priceData && priceData.original_amount > priceData.calculated_amount
      ? formatRub(priceData.original_amount / 100, currencyCode)
      : undefined;

  return {
    id: product.id,
    slug: product.handle,
    title: product.title,
    description: product.description ?? undefined,
    image: product.thumbnail ?? "/assets/figma/placeholder.svg",
    price,
    oldPrice,
  };
}

export function mapMedusaLineItemToCartItem(
  item: MedusaLineItem,
  currencyCode = "rub"
): CommerceCartItem {
  return {
    id: item.variant_id,
    title: item.title,
    image: item.thumbnail ?? "/assets/figma/placeholder.svg",
    price: formatRub(item.unit_price / 100, currencyCode),
    quantity: item.quantity,
    size: item.variant?.title,
  };
}
