import Link from "next/link";
import Image from "next/image";
import { Button } from "@/design-system";
import type { Order } from "@/data/account";

export function OrderCard({ order }: { order: Order }) {
  const statusColor =
    order.status === "Отменён"
      ? "text-[var(--color-error)] bg-red-50"
      : "text-[var(--color-black)] bg-[var(--color-selection)]";

  return (
    <div className="rounded-[5px] border border-[var(--color-gray-light)] p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-gray)]">СТАТУС ЗАКАЗА</span>
          <span className={`rounded px-2 py-0.5 text-xs ${statusColor}`}>{order.status}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[var(--color-gray)]">
            НОМЕР ЗАКАЗА <span className="text-[var(--color-black)]">{order.number}</span>
          </span>
          <span className="text-[var(--color-dark-gray)]">
            оплачено <span className="font-medium text-[var(--color-black)]">{order.total}</span>
          </span>
        </div>
      </div>

      {/* Product images */}
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {order.products.map((product) => (
          <div
            key={product.id}
            className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[5px] bg-[var(--color-selection)] md:h-[100px] md:w-[100px]"
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-1 left-1 rounded bg-[var(--color-brand)] px-1.5 py-0.5 text-[10px] text-[var(--color-light)]">
                {product.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Delivery info */}
      <div className="mt-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div className="text-sm text-[var(--color-dark-gray)]">
          <p>{order.deliveryType}</p>
          <p className="text-[var(--color-gray)]">
            ДАТА ДОСТАВКИ{" "}
            <span className="text-[var(--color-dark-gray)]">{order.deliveryDate}</span>
          </p>
        </div>
        <Link href="/account/orders">
          <Button variant="secondary" size="small">
            Заказ в работе
          </Button>
        </Link>
      </div>
    </div>
  );
}
