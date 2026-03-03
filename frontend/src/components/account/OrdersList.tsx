"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/design-system";
import { OrderCard } from "./OrderCard";
import type { Order } from "@/data/account";
import type { MedusaOrder } from "@/types/medusa";

function mapStatus(status: string): Order["status"] {
  if (status === "completed") return "Получен";
  if (status === "cancelled") return "Отменён";
  if (status === "shipped" || status === "partially_shipped") return "В доставке";
  return "Обработка";
}

function mapOrder(o: MedusaOrder): Order {
  return {
    id: o.id,
    number: String(o.display_id),
    status: mapStatus(o.status),
    date: o.created_at,
    deliveryType: "Доставка",
    deliveryAddress:
      [o.shipping_address?.address_1, o.shipping_address?.city].filter(Boolean).join(", ") || "—",
    deliveryDate: "Уточняется",
    paymentMethod: "Онлайн",
    total: `${Math.round(o.total / 100).toLocaleString("ru-RU")} ₽`,
    products: o.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: "",
      price: `${Math.round(item.unit_price / 100).toLocaleString("ru-RU")} ₽`,
      image: item.thumbnail ?? "/placeholder.jpg",
    })),
  };
}

export function OrdersList() {
  const [activeTab, setActiveTab] = useState<"current" | "completed">("current");
  const [visibleCount, setVisibleCount] = useState(4);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/orders")
      .then((res) => res.json())
      .then((data: { orders?: MedusaOrder[] }) => {
        setAllOrders((data.orders ?? []).map(mapOrder));
      })
      .catch(() => setAllOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  const currentOrders = allOrders.filter(
    (o) => o.status === "Обработка" || o.status === "В доставке"
  );
  const completedOrders = allOrders.filter((o) => o.status === "Получен" || o.status === "Отменён");
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
      {isLoading ? (
        <p className="text-sm text-[var(--color-gray)]">Загрузка заказов...</p>
      ) : displayedOrders.length === 0 ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-base font-medium text-[var(--color-black)]">
              {activeTab === "current"
                ? "У вас пока нет актуальных заказов"
                : "Нет завершённых заказов"}
            </p>
            <p className="mt-2 text-sm text-[var(--color-dark-gray)]">
              Когда появятся, будут отображаться здесь.{" "}
              {activeTab === "current" && "Остальные заказы находятся в завершённых"}
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
