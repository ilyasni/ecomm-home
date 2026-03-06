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
  quickFilterValues?: string[];
  activeQuickFilterValues?: string[];
  onToggleQuickFilter?: (value: string) => void;
  className?: string;
};

const defaultQuickFilters = [
  { id: "discount", value: "sale", label: "Скидки" },
  { id: "new", value: "new", label: "Новинки" },
  { id: "special", value: "special", label: "Спец. предложения" },
];

export function CatalogFilters({
  tags = [],
  onClearAll,
  onOpenFilters,
  quickFilterValues,
  activeQuickFilterValues = [],
  onToggleQuickFilter,
  className,
}: CatalogFiltersProps) {
  const quickFilters = quickFilterValues
    ? defaultQuickFilters.filter((filter) => quickFilterValues.includes(filter.value))
    : defaultQuickFilters;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      {quickFilters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onToggleQuickFilter?.(filter.value)}
          className={`rounded-[5px] border px-3 py-1 text-sm transition-colors ${
            activeQuickFilterValues.includes(filter.value)
              ? "border-[var(--color-brown)] bg-[var(--color-selection)] text-[var(--color-black)]"
              : "border-[var(--color-gray-light)] text-[var(--color-dark-gray)] hover:border-[var(--color-brown)]"
          }`}
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
              className="flex items-center justify-center transition-opacity hover:opacity-80"
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
          className="text-sm text-[var(--color-brand)] transition-opacity hover:opacity-80"
        >
          Очистить все
        </button>
      )}

      {onOpenFilters && (
        <button
          type="button"
          onClick={onOpenFilters}
          className="ml-auto flex items-center gap-1 text-sm text-[var(--color-dark-gray)] transition-colors hover:text-[var(--color-black)]"
        >
          <span>Все фильтры</span>
          <Icon name="chevronDown" size={16} className="rotate-[-90deg]" />
        </button>
      )}
    </div>
  );
}
