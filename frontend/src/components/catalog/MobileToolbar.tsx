"use client";

import { Icon } from "@/design-system/icons";

type MobileToolbarProps = {
  onOpenFilters: () => void;
  onToggleSort: () => void;
  gridColumns: number;
  onGridChange: (cols: number) => void;
  gridOptions?: number[];
  className?: string;
};

export function MobileToolbar({
  onOpenFilters,
  onToggleSort,
  gridColumns,
  onGridChange,
  gridOptions = [1, 2],
  className,
}: MobileToolbarProps) {
  return (
    <div className={`flex items-center justify-between desktop:hidden ${className || ""}`}>
      <div className="flex items-center gap-4 md:gap-6">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex items-center gap-1 text-sm md:text-base text-[var(--color-dark-gray)]"
        >
          <span>Фильтры</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="opacity-70">
            <path d="M2 4h14M4 9h10M6 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onToggleSort}
          className="flex items-center gap-1 text-sm md:text-base text-[var(--color-dark-gray)]"
        >
          <span>Сортировка</span>
          <Icon name="chevronDown" size={16} />
        </button>
      </div>
      <div className="flex items-center gap-1">
        {gridOptions.includes(1) && (
          <button
            type="button"
            onClick={() => onGridChange(1)}
            className={`p-1 transition-opacity md:hidden ${gridColumns === 1 ? "opacity-100" : "opacity-40"}`}
            aria-label="1 колонка"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect width="14" height="14" fill="currentColor" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => onGridChange(2)}
          className={`p-1 transition-opacity ${gridColumns === 2 ? "opacity-100" : "opacity-40"}`}
          aria-label="2 колонки"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="10" height="10" fill="currentColor" />
            <rect x="12" width="10" height="10" fill="currentColor" />
            <rect y="12" width="10" height="10" fill="currentColor" />
            <rect x="12" y="12" width="10" height="10" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onGridChange(3)}
          className={`hidden p-1 transition-opacity md:block ${gridColumns === 3 ? "opacity-100" : "opacity-40"}`}
          aria-label="3 колонки"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="6" height="6" fill="currentColor" />
            <rect x="8" width="6" height="6" fill="currentColor" />
            <rect x="16" width="6" height="6" fill="currentColor" />
            <rect y="8" width="6" height="6" fill="currentColor" />
            <rect x="8" y="8" width="6" height="6" fill="currentColor" />
            <rect x="16" y="8" width="6" height="6" fill="currentColor" />
            <rect y="16" width="6" height="6" fill="currentColor" />
            <rect x="8" y="16" width="6" height="6" fill="currentColor" />
            <rect x="16" y="16" width="6" height="6" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
