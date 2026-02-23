"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/design-system/icons";

type SizeRow = {
  sku: string;
  kit: string;
  duvet: string;
  sheet: string;
  pillowcase: string;
};

const sizeData: SizeRow[] = [
  {
    sku: "1234567",
    kit: "Двуспальный евро (200 x 210)",
    duvet: "200 x 210 см",
    sheet: "270 x 300 см",
    pillowcase: "50 x 70 см — 2 шт.",
  },
  {
    sku: "1234567",
    kit: "Семейный/дуэт (140 x 200 — 2 шт.)",
    duvet: "145 x 200 см",
    sheet: "270 x 300 см",
    pillowcase: "50 x 70 см — 2 шт.",
  },
  {
    sku: "1234567",
    kit: "Двуспальный евро (200 x 210)",
    duvet: "200 x 210 см",
    sheet: "270 x 300 см",
    pillowcase: "50 x 70 см — 2 шт.",
  },
  {
    sku: "1234567",
    kit: "Семейный/дуэт (140 x 200 — 2 шт.)",
    duvet: "145 x 200 см",
    sheet: "270 x 300 см",
    pillowcase: "50 x 70 см — 2 шт.",
  },
];

const columns = [
  { key: "sku" as const, label: "Артикул", width: "w-[98px] desktop:w-[120px]" },
  { key: "kit" as const, label: "Комплект", width: "w-[130px] desktop:w-[180px]" },
  { key: "duvet" as const, label: "Пододеяльник", width: "w-[109px] desktop:w-[150px]" },
  { key: "sheet" as const, label: "Простыня", width: "w-[100px] desktop:w-[150px]" },
  { key: "pillowcase" as const, label: "Наволочка", width: "w-[100px] desktop:w-[150px]" },
];

type SizeChartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;

    const updateThumb = () => {
      const ratio = el.clientWidth / el.scrollWidth;
      const thumbWidth = Math.max(ratio * 100, 20);
      const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
      const thumbLeft = scrollRatio * (100 - thumbWidth);

      thumb.style.width = `${thumbWidth}%`;
      thumb.style.left = `${thumbLeft}%`;
      thumb.parentElement!.style.display = ratio >= 1 ? "none" : "block";
    };

    updateThumb();
    el.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);

    return () => {
      el.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Modal */}
      <div
        className="relative z-10 mt-12 w-[calc(100%-32px)] max-w-[820px] rounded-[5px] bg-[var(--background)] desktop:mt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 hover:opacity-70 transition-opacity"
          aria-label="Закрыть"
        >
          <Icon name="close" size={24} />
        </button>

        {/* Content */}
        <div className="px-4 py-6 desktop:px-10 desktop:py-12">
          {/* Title inside the table border */}
          <div className="overflow-hidden rounded-[5px] border border-[var(--color-gray-light)]">
            <div className="border-b border-[var(--color-gray-light)] px-6 py-4">
              <h2 className="text-[16px] font-medium leading-[1.1] desktop:text-[20px]">
                Размеры комплектов постельного белья
              </h2>
            </div>

            {/* Table with horizontal scroll */}
            <div
              ref={scrollRef}
              className="overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <table className="w-full min-w-[535px] border-collapse">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`border-b border-r border-[var(--color-gray-light)] px-3 py-2 text-left text-[12px] font-medium leading-[1.1] text-[var(--color-black)] last:border-r-0 desktop:px-6 desktop:py-4 desktop:text-[14px] ${col.width}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx % 2 === 1
                          ? "bg-[var(--color-selection)]"
                          : "bg-transparent"
                      }
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`border-r border-[var(--color-gray-light)] px-3 py-3 text-[12px] leading-[1.1] text-[var(--color-dark)] last:border-r-0 desktop:px-6 desktop:py-5 desktop:text-[14px] ${
                            col.key === "sku" ? "font-medium text-[var(--color-black)]" : "font-normal"
                          }`}
                        >
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom scrollbar indicator */}
          <div className="relative mt-3 h-[3px] w-full max-w-[343px]">
            <div className="absolute inset-0 rounded-full bg-[var(--color-gray-light)]" />
            <div
              ref={thumbRef}
              className="absolute top-0 h-[3px] rounded-full bg-[var(--color-gray)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
