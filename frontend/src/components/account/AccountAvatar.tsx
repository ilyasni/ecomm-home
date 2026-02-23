"use client";

import Link from "next/link";
import { accountUser } from "@/data/account";

export function AccountAvatar() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[var(--color-selection)]">
        <span className="text-lg font-medium text-[var(--color-brand)]">
          {accountUser.initials}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium text-[var(--color-black)]">
          {accountUser.firstName} {accountUser.lastName}
        </span>
        <Link
          href="/account/profile"
          className="text-sm text-[var(--color-brand)] underline hover:no-underline"
        >
          Изменить профиль
        </Link>
        <span className="text-sm font-medium text-[var(--color-brand)]">
          {accountUser.bonuses} БОНУСОВ
        </span>
      </div>
    </div>
  );
}
