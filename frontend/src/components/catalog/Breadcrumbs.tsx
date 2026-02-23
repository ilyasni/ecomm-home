"use client";

import { Icon } from "@/design-system/icons";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "dark" | "light";
};

export function Breadcrumbs({ items, className, variant = "dark" }: BreadcrumbsProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-[var(--color-light)]" : "text-[var(--color-gray)]";
  const activeColor = isLight ? "text-white" : "text-[var(--color-black)]";

  return (
    <nav className={`flex items-center gap-2 text-sm ${textColor} ${className || ""}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <Icon name="chevronDown" size={16} className={`rotate-[-90deg] ${textColor}`} />
          )}
          {item.href ? (
            <a href={item.href} className="hover:opacity-80 transition-opacity">
              {item.label}
            </a>
          ) : (
            <span className={activeColor}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
