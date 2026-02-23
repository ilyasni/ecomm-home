import Link from "next/link";
import { accountUser } from "@/data/account";

function DashboardCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[5px] border border-[var(--color-gray-light)] p-6 flex flex-col gap-4 ${className}`}
    >
      <span className="text-base font-medium text-[var(--color-black)]">
        {title}
      </span>
      {children}
    </div>
  );
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <DashboardCard title="Накоплено бонусов">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-medium text-[var(--color-brand)]">
            {accountUser.bonuses} БОНУСОВ
          </span>
          <span className="text-sm text-[var(--color-gray)]">
            программа лояльности
          </span>
        </div>
      </DashboardCard>

      <DashboardCard title="Заказы">
        <div className="flex gap-2">
          <Link
            href="/account/orders"
            className="rounded-[5px] border border-[var(--color-black)] px-3 py-1.5 text-sm text-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-light)] transition-colors"
          >
            Все заказы (0)
          </Link>
          <Link
            href="/account/orders"
            className="rounded-[5px] border border-[var(--color-black)] px-3 py-1.5 text-sm text-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-light)] transition-colors"
          >
            Последний заказ
          </Link>
        </div>
      </DashboardCard>

      <DashboardCard title="Корзина">
        <Link
          href="/cart"
          className="self-start rounded-[5px] bg-[var(--color-brand)] px-4 py-1.5 text-sm text-[var(--color-light)] hover:bg-[var(--color-gold)] hover:text-[var(--color-brand)] transition-colors"
        >
          Товары (5)
        </Link>
      </DashboardCard>

      <DashboardCard title="Профиль">
        <Link
          href="/account/profile"
          className="self-start rounded-[5px] bg-[var(--color-brand)] px-4 py-1.5 text-sm text-[var(--color-light)] hover:bg-[var(--color-gold)] hover:text-[var(--color-brand)] transition-colors"
        >
          Изменить
        </Link>
      </DashboardCard>
    </div>
  );
}
