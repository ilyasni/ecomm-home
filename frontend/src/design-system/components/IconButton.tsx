"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 24 | 40;
  tone?: "default" | "accent" | "muted";
  children: ReactNode;
};

export function IconButton({
  size = 40,
  tone = "default",
  className,
  children,
  ...props
}: IconButtonProps) {
  const sizeClass = size === 40 ? "h-10 w-10" : "h-6 w-6";
  const toneClass =
    tone === "accent"
      ? "border-[var(--color-brand)]"
      : tone === "muted"
        ? "border-[var(--color-gray)]"
        : "border-[var(--color-gray-light)]";

  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-full border ${toneClass} ${sizeClass} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
