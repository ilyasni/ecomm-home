"use client";

import { newsCategories as defaultNewsCategories, type NewsCategory } from "@/data/news";

type NewsTabsProps = {
  active: NewsCategory;
  onChange: (category: NewsCategory) => void;
  categories?: NewsCategory[];
  className?: string;
};

export function NewsTabs({ active, onChange, categories, className }: NewsTabsProps) {
  const items = categories ?? defaultNewsCategories;
  return (
    <div
      className={`scrollbar-none flex items-center justify-center gap-6 overflow-x-auto text-[16px] leading-[1.3] font-normal text-[var(--color-black)] ${className || ""}`}
    >
      {items.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap capitalize transition-colors ${
            active === cat ? "underline underline-offset-4" : "hover:text-[var(--color-brand)]"
          }`}
        >
          {cat === "все" ? "Все" : cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}
