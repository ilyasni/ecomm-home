"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/design-system/icons";
import { Checkbox, Button } from "@/design-system/components";

type FilterSection = {
  id: string;
  title: string;
  options: Array<{ id: string; label: string; checked: boolean }>;
};

type FiltersPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Текущие активные фильтры из URL — ключ = section.id, значения = labels */
  initialValues?: Record<string, string[]>;
  /** Вызывается при нажатии «Применить» с выбранными фильтрами */
  onApply?: (values: Record<string, string[]>) => void;
  /** Meilisearch facetDistribution: { fabric: { Сатин: 45 }, color: { Белый: 23 } } */
  facetDistribution?: Record<string, Record<string, number>>;
  className?: string;
};

const initialFilters: FilterSection[] = [
  {
    id: "fabric",
    title: "Ткань",
    options: [
      { id: "bamboo", label: "Бамбуковое волокно", checked: false },
      { id: "egyptian", label: "Египетский хлопок", checked: false },
      { id: "satin", label: "Сатин", checked: false },
      { id: "silk", label: "Шёлк", checked: false },
    ],
  },
  {
    id: "density",
    title: "Плотность ткани",
    options: [
      { id: "200tc", label: "200 TC", checked: false },
      { id: "220tc", label: "220 TC", checked: false },
      { id: "250tc", label: "250 TC", checked: false },
      { id: "280tc", label: "280 TC", checked: false },
      { id: "300tc", label: "300 TC", checked: false },
      { id: "480tc", label: "480 TC", checked: false },
      { id: "700tc", label: "700 TC", checked: false },
    ],
  },
  {
    id: "size",
    title: "Размер",
    options: [
      { id: "euro", label: "Евро", checked: false },
      { id: "family", label: "Семейный", checked: false },
    ],
  },
  {
    id: "color",
    title: "Цвет",
    options: [
      { id: "beige", label: "Бежевый", checked: false },
      { id: "white", label: "Белый", checked: false },
      { id: "burgundy", label: "Бордовый", checked: false },
      { id: "blue", label: "Голубой", checked: false },
      { id: "yellow", label: "Жёлтый", checked: false },
      { id: "red", label: "Красный", checked: false },
    ],
  },
  {
    id: "price",
    title: "Цена",
    options: [
      { id: "light", label: "Light (от 10 000 ₽)", checked: false },
      { id: "medium", label: "Medium (от 20 000 ₽)", checked: false },
      { id: "premium", label: "Premium (от 35 000 ₽)", checked: false },
    ],
  },
  {
    id: "promo",
    title: "Акции",
    options: [{ id: "special", label: "Специальные предложения", checked: false }],
  },
];

export function FiltersPanel({
  isOpen,
  onClose,
  initialValues,
  onApply,
  facetDistribution,
}: FiltersPanelProps) {
  const [filters, setFilters] = useState<FilterSection[]>(initialFilters);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(initialFilters.map((f) => f.id))
  );

  // Синхронизируем состояние чекбоксов с URL-параметрами при каждом открытии панели
  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(
      initialFilters.map((section) => ({
        ...section,
        options: section.options.map((opt) => ({
          ...opt,
          checked: (initialValues?.[section.id] ?? []).includes(opt.label),
        })),
      }))
    );
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleOption = (sectionId: string, optionId: string) => {
    setFilters((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.map((opt) =>
                opt.id === optionId ? { ...opt, checked: !opt.checked } : opt
              ),
            }
          : section
      )
    );
  };

  const selectedCount = filters.reduce(
    (acc, section) => acc + section.options.filter((o) => o.checked).length,
    0
  );

  const resetAll = () => {
    setFilters(initialFilters);
  };

  const handleApply = () => {
    const values: Record<string, string[]> = {};
    filters.forEach((section) => {
      const checked = section.options.filter((o) => o.checked).map((o) => o.label);
      if (checked.length > 0) values[section.id] = checked;
    });
    onApply?.(values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 transition-opacity" onClick={onClose} />
      <div className="desktop:w-[720px] relative z-10 flex h-full w-full flex-col bg-white md:w-[600px]">
        <div className="flex items-center justify-between border-b border-[var(--color-gray-light)] px-6 py-5">
          <h2 className="text-xl font-medium">Фильтры</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            aria-label="Закрыть"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filters.map((section) => (
            <div key={section.id} className="border-b border-[var(--color-gray-light)] py-4">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between"
              >
                <span className="text-base font-medium">{section.title}</span>
                <Icon
                  name="chevronDown"
                  size={20}
                  className={`transition-transform ${
                    expandedSections.has(section.id) ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.has(section.id) && (
                <div className="mt-3 space-y-3">
                  {section.options.map((option) => {
                    const count = facetDistribution?.[section.id]?.[option.label];
                    return (
                      <Checkbox
                        key={option.id}
                        checked={option.checked}
                        onChange={() => toggleOption(section.id, option.id)}
                        label={count !== undefined ? `${option.label} (${count})` : option.label}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-gray-light)] px-6 py-4">
          <p className="mb-4 text-center text-sm text-[var(--color-gray)]">
            {selectedCount > 0 ? `${selectedCount} позиций` : "Выберите фильтры"}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={resetAll}>
              Сбросить все
            </Button>
            <Button variant="primary" fullWidth onClick={handleApply}>
              Применить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
