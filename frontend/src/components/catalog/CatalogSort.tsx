"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/design-system/icons";

type SortOption = {
  value: string;
  label: string;
};

type CatalogSortProps = {
  options?: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

const defaultOptions: SortOption[] = [
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "По возрастанию цены" },
  { value: "price-desc", label: "По убыванию цены" },
  { value: "new", label: "Новинки" },
];

const quickTabs = [
  { value: "new", label: "Новинки" },
  { value: "sale", label: "Скидки" },
  { value: "hits", label: "Хиты продаж" },
];

export function CatalogSort({
  options = defaultOptions,
  value,
  onChange,
  className,
}: CatalogSortProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${className || ""}`}>
      {/* Tablet + Desktop: quick tabs */}
      <div className="hidden md:flex items-center justify-center gap-6 text-base text-[var(--color-dark)]">
        {quickTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange?.(tab.value)}
            className={`transition-opacity hover:opacity-80 ${
              value === tab.value ? "font-medium text-[var(--color-black)]" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Desktop only: full sort line */}
      <div className="hidden desktop:flex items-center gap-2 text-sm text-[var(--color-gray)] mt-6">
        <span>Сортировка:</span>
        <div className="flex items-center gap-1">
          {options.map((option, index) => (
            <div key={option.value} className="flex items-center">
              {index > 0 && <span className="mx-2 text-[var(--color-gray-light)]">|</span>}
              <button
                type="button"
                onClick={() => onChange?.(option.value)}
                className={`hover:opacity-80 transition-opacity ${
                  value === option.value ? "text-[var(--color-black)] font-medium" : ""
                }`}
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: dropdown button */}
      <div className="relative md:hidden" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 text-sm text-[var(--color-dark-gray)]"
        >
          <span>Сортировка</span>
          <Icon
            name="chevronDown"
            size={16}
            className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute left-0 top-full z-30 mt-2 w-[220px] rounded-[5px] border border-[var(--color-gray-light)] bg-white py-2 shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setIsDropdownOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--color-selection)] ${
                  value === option.value
                    ? "text-[var(--color-black)] font-medium"
                    : "text-[var(--color-dark-gray)]"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    value === option.value
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)]"
                      : "border-[var(--color-gray-light)]"
                  }`}
                >
                  {value === option.value && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
