"use client";

import { infoCategories } from "@/data/customer-info";

type InfoSidebarProps = {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
};

export function InfoSidebar({
  activeCategory,
  onCategoryChange,
}: InfoSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden desktop:block w-[200px] shrink-0">
        <nav className="flex flex-col gap-2">
          {infoCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`text-left text-sm leading-[1.3] py-2 px-3 rounded-[5px] transition-colors ${
                activeCategory === cat.id
                  ? "bg-[var(--color-selection)] font-medium text-[var(--color-foreground)]"
                  : "text-[var(--color-dark)] hover:bg-[var(--color-selection)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        <a
          href="/"
          className="mt-6 inline-block text-sm text-[var(--color-brand)] underline"
        >
          Вернуться на главную
        </a>
      </aside>

      {/* Mobile/tablet horizontal tabs */}
      <div className="desktop:hidden overflow-x-auto">
        <div className="flex gap-2 min-w-max px-4 md:px-0">
          {infoCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`text-sm leading-[1.3] py-2 px-4 rounded-[5px] whitespace-nowrap transition-colors ${
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
