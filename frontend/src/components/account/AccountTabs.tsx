"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountAvatar } from "./AccountAvatar";

const tabs = [
  { label: "Главная", href: "/account" },
  { label: "Лояльность", href: "/account/loyalty" },
  { label: "Адреса", href: "/account/address" },
  { label: "Профиль", href: "/account/profile" },
  { label: "Заказы", href: "/account/orders" },
  { label: "Уведомления", href: "/account/notifications" },
  { label: "Акции", href: "/account/promotions" },
];

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 md:hidden">
      <AccountAvatar />

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`shrink-0 rounded-[5px] px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "border border-[var(--color-black)] text-[var(--color-black)]"
                  : "border border-[var(--color-gray-light)] text-[var(--color-dark-gray)] hover:border-[var(--color-gray)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
