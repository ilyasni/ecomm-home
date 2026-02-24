import type { CommerceOrder, CommerceProductRef, CommerceSnapshot } from "@/lib/commerce/types";
import { addToCart, createOrder, getCommerceSnapshot, toggleFavorite } from "@/lib/commerce/store";

/**
 * Единый фасад storefront-коммерции.
 * Сейчас используется локальное хранилище как MVP-адаптер.
 * На этапе миграции можно заменить реализацию на Medusa без изменения UI.
 */
export const commerceApi = {
  getSnapshot(): CommerceSnapshot {
    return getCommerceSnapshot();
  },
  addToCart(product: CommerceProductRef, quantity = 1) {
    addToCart(product, quantity);
  },
  toggleFavorite(product: CommerceProductRef) {
    return toggleFavorite(product);
  },
  createOrder(input: {
    customerName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    paymentMethod: string;
    deliveryMethod: string;
  }): CommerceOrder {
    return createOrder(input);
  },
};
