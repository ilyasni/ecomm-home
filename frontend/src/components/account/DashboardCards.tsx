"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
      className={`flex flex-col gap-4 rounded-[5px] border border-[var(--color-gray-light)] p-6 ${className}`}
    >
      <span className="text-base font-medium text-[var(--color-black)]">{title}</span>
      {children}
    </div>
  );
}

export function DashboardCards() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/account/bonuses")
      .then((r) => r.json())
      .then((d: { balance?: number }) => setBalance(d.balance ?? 0))
      .catch(() => setBalance(0));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <DashboardCard title="Накоплено бонусов">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-medium text-[var(--color-brand)]">
            {balance === null ? "..." : `${balance} БОНУСОВ`}
          </span>
          <span className="text-sm text-[var(--color-gray)]">программа лояльности</span>
        </div>
      </DashboardCard>

      <DashboardCard title="Заказы">
        <div className="flex gap-2">
          <Link
            href="/account/orders"
            className="rounded-[5px] border border-[var(--color-black)] px-3 py-1.5 text-sm text-[var(--color-black)] transition-colors hover:bg-[var(--color-black)] hover:text-[var(--color-light)]"
          >
            Все заказы (0)
          </Link>
          <Link
            href="/account/orders"
            className="rounded-[5px] border border-[var(--color-black)] px-3 py-1.5 text-sm text-[var(--color-black)] transition-colors hover:bg-[var(--color-black)] hover:text-[var(--color-light)]"
          >
            Последний заказ
          </Link>
        </div>
      </DashboardCard>

      <DashboardCard title="Корзина">
        <Link
          href="/cart"
          className="self-start rounded-[5px] bg-[var(--color-brand)] px-4 py-1.5 text-sm text-[var(--color-light)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-brand)]"
        >
          Товары (5)
        </Link>
      </DashboardCard>

      <DashboardCard title="Профиль">
        <Link
          href="/account/profile"
          className="self-start rounded-[5px] bg-[var(--color-brand)] px-4 py-1.5 text-sm text-[var(--color-light)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-brand)]"
        >
          Изменить
        </Link>
      </DashboardCard>
    </div>
  );
}
