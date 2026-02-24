"use client";

import Link from "next/link";
import { infoCategories as defaultInfoCategories } from "@/data/customer-info";
import type { InfoCategory } from "@/data/customer-info";

type InfoSidebarProps = {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  categories?: InfoCategory[];
};

export function InfoSidebar({ activeCategory, onCategoryChange, categories }: InfoSidebarProps) {
  const infoCategories = categories ?? defaultInfoCategories;
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="desktop:block hidden w-[200px] shrink-0">
        <nav className="flex flex-col gap-2">
          {infoCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-[5px] px-3 py-2 text-left text-sm leading-[1.3] transition-colors ${
                activeCategory === cat.id
                  ? "bg-[var(--color-selection)] font-medium text-[var(--color-foreground)]"
                  : "text-[var(--color-dark)] hover:bg-[var(--color-selection)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        <Link href="/" className="mt-6 inline-block text-sm text-[var(--color-brand)] underline">
          Вернуться на главную
        </Link>
      </aside>

      {/* Mobile/tablet horizontal tabs */}
      <div className="desktop:hidden overflow-x-auto">
        <div className="flex min-w-max gap-2 px-4 md:px-0">
          {infoCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-[5px] px-4 py-2 text-sm leading-[1.3] whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-[var(--color-selection)] font-medium text-[var(--color-foreground)]"
                  : "text-[var(--color-dark)] hover:bg-[var(--color-selection)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
