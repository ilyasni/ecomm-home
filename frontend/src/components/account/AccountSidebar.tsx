"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountAvatar } from "./AccountAvatar";
import { sidebarNavigation } from "@/data/account";

function NavGroup({
  title,
  items,
  currentPath,
}: {
  title: string;
  items: { label: string; href: string }[];
  currentPath: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[var(--color-black)]">
        {title}
      </span>
      {items.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm transition-colors ${
              isActive
                ? "rounded-[5px] border border-[var(--color-gray-light)] px-2 py-1 text-[var(--color-black)]"
                : "px-2 py-1 text-[var(--color-dark-gray)] hover:text-[var(--color-black)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function AccountSidebar() {
  const pathname = usePathname();

  const groups = [
    sidebarNavigation.personalInfo,
    sidebarNavigation.orders,
    sidebarNavigation.subscriptions,
    sidebarNavigation.promotions,
  ];

  return (
    <aside className="hidden md:flex w-full md:w-[300px] desktop:w-[447px] shrink-0 flex-col gap-6 border border-[var(--color-gray-light)] rounded-[5px] p-6">
      <AccountAvatar />

      {groups.map((group) => (
        <NavGroup
          key={group.title}
          title={group.title}
          items={group.items}
          currentPath={pathname}
        />
      ))}

      <button
        type="button"
        className="self-start text-sm text-[var(--color-brand)] hover:underline"
      >
        Выйти
      </button>
    </aside>
  );
}
