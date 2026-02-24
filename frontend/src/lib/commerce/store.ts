"use client";

import type { CommerceOrder, CommerceProductRef, CommerceSnapshot } from "@/lib/commerce/types";

const STORAGE_KEY = "vitabrava:commerce:v1";
const UPDATE_EVENT = "commerce:updated";

const initialSnapshot: CommerceSnapshot = {
  cartItems: [],
  favorites: [],
  orders: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function toNumber(price: string): number {
  return Number(price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
}

function formatPrice(value: number): string {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function readSnapshot(): CommerceSnapshot {
  if (!isBrowser()) {
    return initialSnapshot;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialSnapshot;
    const parsed = JSON.parse(raw) as Partial<CommerceSnapshot>;
    return {
      cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return initialSnapshot;
  }
}

function writeSnapshot(snapshot: CommerceSnapshot) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function subscribeCommerce(listener: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => listener();
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getCommerceSnapshot(): CommerceSnapshot {
  return readSnapshot();
}

export function getCartCount(): number {
  return readSnapshot().cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

export function getFavoritesCount(): number {
  return readSnapshot().favorites.length;
}

export function isFavoriteProduct(productId: string): boolean {
  return readSnapshot().favorites.some((item) => item.id === productId);
}

export function toggleFavorite(product: CommerceProductRef): boolean {
  const snapshot = readSnapshot();
  const exists = snapshot.favorites.some((item) => item.id === product.id);
  snapshot.favorites = exists
    ? snapshot.favorites.filter((item) => item.id !== product.id)
    : [...snapshot.favorites, product];

  snapshot.cartItems = snapshot.cartItems.map((item) =>
    item.id === product.id
      ? {
          ...item,
          isFavorite: !exists,
        }
      : item
  );
  writeSnapshot(snapshot);
  return !exists;
}

export function addToCart(product: CommerceProductRef, quantity = 1) {
  const snapshot = readSnapshot();
  const existing = snapshot.cartItems.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    snapshot.cartItems.push({
      ...product,
      quantity,
      isFavorite: isFavoriteProduct(product.id),
    });
  }
  writeSnapshot(snapshot);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const snapshot = readSnapshot();
  snapshot.cartItems = snapshot.cartItems
    .map((item) => (item.id === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  writeSnapshot(snapshot);
}

export function removeCartItem(productId: string) {
  const snapshot = readSnapshot();
  snapshot.cartItems = snapshot.cartItems.filter((item) => item.id !== productId);
  writeSnapshot(snapshot);
}

export function clearCart() {
  const snapshot = readSnapshot();
  snapshot.cartItems = [];
  writeSnapshot(snapshot);
}

export function clearFavorites() {
  const snapshot = readSnapshot();
  snapshot.favorites = [];
  snapshot.cartItems = snapshot.cartItems.map((item) => ({ ...item, isFavorite: false }));
  writeSnapshot(snapshot);
}

export function createOrder(payload: {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryMethod: string;
}): CommerceOrder {
  const snapshot = readSnapshot();
  const totalNumber = snapshot.cartItems.reduce(
    (sum, item) => sum + toNumber(item.price) * item.quantity,
    0
  );

  const order: CommerceOrder = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    total: formatPrice(totalNumber),
    status: "processing",
    items: snapshot.cartItems,
    customerName: payload.customerName,
    email: payload.email,
    phone: payload.phone,
    deliveryAddress: payload.deliveryAddress,
    paymentMethod: payload.paymentMethod,
    deliveryMethod: payload.deliveryMethod,
  };

  snapshot.orders = [order, ...snapshot.orders];
  snapshot.cartItems = [];
  writeSnapshot(snapshot);
  return order;
}
