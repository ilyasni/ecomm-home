"use client";

import { newsCategories, type NewsCategory } from "@/data/news";

type NewsTabsProps = {
  active: NewsCategory;
  onChange: (category: NewsCategory) => void;
  className?: string;
};

export function NewsTabs({ active, onChange, className }: NewsTabsProps) {
  return (
    <div
      className={`flex items-center justify-center gap-6 text-[16px] font-normal leading-[1.3] text-[var(--color-black)] overflow-x-auto scrollbar-none ${className || ""}`}
    >
      {newsCategories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`capitalize transition-colors whitespace-nowrap ${
            active === cat
              ? "underline underline-offset-4"
              : "hover:text-[var(--color-brand)]"
          }`}
        >
          {cat === "все" ? "Все" : cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}
