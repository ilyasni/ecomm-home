"use client";

import { Icon } from "@/design-system/icons";

type FilterTag = {
  id: string;
  label: string;
  onRemove?: () => void;
};

type CatalogFiltersProps = {
  tags?: FilterTag[];
  onClearAll?: () => void;
  onOpenFilters?: () => void;
  className?: string;
};

const defaultQuickFilters = [
  { id: "discount", label: "Скидки" },
  { id: "new", label: "Новинки" },
  { id: "special", label: "Спец. предложения" },
];

export function CatalogFilters({
  tags = [],
  onClearAll,
  onOpenFilters,
  className,
}: CatalogFiltersProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      {defaultQuickFilters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className="rounded-[5px] border border-[var(--color-gray-light)] px-3 py-1 text-sm text-[var(--color-dark-gray)] hover:border-[var(--color-brown)] transition-colors"
        >
          {filter.label}
        </button>
      ))}

      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-1 rounded-[5px] border border-[var(--color-brown)] bg-[var(--color-selection)] px-3 py-1 text-sm"
        >
          <span>{tag.label}</span>
          {tag.onRemove && (
            <button
              type="button"
              onClick={tag.onRemove}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Удалить фильтр"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      ))}

      {tags.length > 0 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-[var(--color-brand)] hover:opacity-80 transition-opacity"
        >
          Очистить все
        </button>
      )}

      {onOpenFilters && (
        <button
          type="button"
          onClick={onOpenFilters}
          className="ml-auto flex items-center gap-1 text-sm text-[var(--color-dark-gray)] hover:text-[var(--color-black)] transition-colors"
        >
          <span>Все фильтры</span>
          <Icon name="chevronDown" size={16} className="rotate-[-90deg]" />
        </button>
      )}
    </div>
  );
}
