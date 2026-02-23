"use client";

import Link from "next/link";
import type { Order } from "@/data/account";

export function OrderDetail({ order }: { order: Order }) {
  const statusColor =
    order.status === "Отменён"
      ? "text-[var(--color-error)] bg-red-50"
      : "text-[var(--color-black)] bg-[var(--color-selection)]";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/account/orders"
        className="flex items-center gap-2 text-sm text-[var(--color-dark-gray)] hover:text-[var(--color-black)] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        Вернуться в заказы
      </Link>

      <div className="rounded-[5px] border border-[var(--color-gray-light)] p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-gray)]">СТАТУС ЗАКАЗА</span>
            <span className={`rounded px-2 py-0.5 text-xs ${statusColor}`}>
              {order.status}
            </span>
          </div>
          <span className="text-[var(--color-gray)]">
            НОМЕР ЗАКАЗА{" "}
            <span className="text-[var(--color-black)]">{order.number}</span>
          </span>
          <span className="text-[var(--color-dark-gray)]">
            {order.paymentMethod}{" "}
            <span className="font-medium text-[var(--color-black)]">
              {order.total}
            </span>
          </span>
        </div>

        {/* Delivery info */}
        <div className="mt-4 text-sm text-[var(--color-dark-gray)]">
          <p>{order.deliveryType}</p>
          <p className="text-[var(--color-gray)]">{order.deliveryAddress}</p>
          <p className="mt-1 text-[var(--color-gray)]">
            ДАТА ДОСТАВКИ{" "}
            <span className="text-[var(--color-dark-gray)]">{order.deliveryDate}</span>
          </p>
        </div>

        {/* Product cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {order.products.map((product) => (
            <div key={product.id} className="flex flex-col gap-2">
              <div className="relative aspect-[167/295] rounded-[5px] overflow-hidden bg-[var(--color-selection)]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 rounded bg-[var(--color-brand)] px-2 py-0.5 text-xs text-[var(--color-light)]">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-[var(--color-black)] line-clamp-2">
                  {product.title}
                </span>
                <span className="text-[10px] text-[var(--color-gray)] line-clamp-2">
                  {product.description}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--color-black)]">
                    {product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-[10px] text-[var(--color-gray)] line-through">
                      {product.oldPrice}
                    </span>
                  )}
                </div>
                {product.colors && (
                  <div className="flex gap-1 mt-1">
                    {product.colors.map((color) => (
                      <span
                        key={color.name}
                        className="h-3 w-3 rounded-full border border-[var(--color-gray-light)]"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
