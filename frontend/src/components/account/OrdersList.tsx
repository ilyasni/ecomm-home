"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/design-system";
import { OrderCard } from "./OrderCard";
import { orders } from "@/data/account";
import { getCommerceSnapshot, subscribeCommerce } from "@/lib/commerce";

export function OrdersList() {
  const [activeTab, setActiveTab] = useState<"current" | "completed">("current");
  const [visibleCount, setVisibleCount] = useState(4);
  const [storeOrders, setStoreOrders] = useState<typeof orders>([]);

  useEffect(() => {
    const sync = () => {
      const mapped = getCommerceSnapshot().orders.map((order) => ({
        id: order.id,
        number: order.id,
        status: (order.status === "completed" ? "Получен" : "Обработка") as "Получен" | "Обработка",
        date: order.createdAt,
        deliveryType: order.deliveryMethod,
        deliveryAddress: order.deliveryAddress,
        deliveryDate: "Уточняется",
        paymentMethod: order.paymentMethod,
        total: order.total,
        products: order.items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description ?? "",
          price: item.price,
          image: item.image,
        })),
      }));
      setStoreOrders(mapped);
    };
    sync();
    return subscribeCommerce(sync);
  }, []);

  const currentOrders: typeof orders = [];
  const completedOrders = storeOrders.length > 0 ? storeOrders : orders;

  const displayedOrders = activeTab === "current" ? currentOrders : completedOrders;
  const visibleOrders = displayedOrders.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-[var(--color-black)]">Заказы</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("current");
            setVisibleCount(4);
          }}
          className={`rounded-[5px] border px-3 py-1.5 text-sm transition-colors ${
            activeTab === "current"
              ? "border-[var(--color-black)] text-[var(--color-black)]"
              : "border-[var(--color-gray-light)] text-[var(--color-gray)] hover:border-[var(--color-gray)]"
          }`}
        >
          Актуальные
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("completed");
            setVisibleCount(4);
          }}
          className={`rounded-[5px] border px-3 py-1.5 text-sm transition-colors ${
            activeTab === "completed"
              ? "border-[var(--color-black)] text-[var(--color-black)]"
              : "border-[var(--color-gray-light)] text-[var(--color-gray)] hover:border-[var(--color-gray)]"
          }`}
        >
          Завершенные
        </button>
      </div>

      {/* Content */}
      {displayedOrders.length === 0 ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-base font-medium text-[var(--color-black)]">
              У вас пока нет актуальных заказов
            </p>
            <p className="mt-2 text-sm text-[var(--color-dark-gray)]">
              Когда появятся, будут отображаться здесь. Остальные заказы находятся в завершённых
            </p>
          </div>
          <Link href="/catalog">
            <Button variant="primary" size="small">
              К покупкам
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-[var(--color-gray)]">
            Показано {Math.min(visibleCount, displayedOrders.length)} из {displayedOrders.length}{" "}
            заказов
          </p>
          <div className="flex flex-col gap-4">
            {visibleOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          {visibleCount < displayedOrders.length && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setVisibleCount((prev) => prev + 4)}
              >
                Показать ещё
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
