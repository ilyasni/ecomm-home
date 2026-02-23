"use client";

import { Icon } from "@/design-system/icons";

type ArrowLinkProps = {
  label: string;
  className?: string;
  tone?: "light" | "dark";
  size?: "md" | "lg";
};

export function ArrowLink({
  label,
  className,
  tone = "light",
  size = "md",
}: ArrowLinkProps) {
  const textClass =
    tone === "light" ? "text-[var(--color-light)]" : "text-[var(--color-brand)]";
  const borderClass =
    tone === "light" ? "border-[var(--color-light)]" : "border-[var(--color-brand)]";

  const circleSize = size === "lg" ? "h-[60px] w-[60px]" : "h-10 w-10";
  const textSize = size === "lg" ? "text-base font-medium" : "text-sm md:text-base";

  return (
    <div className={`flex items-center gap-4 ${className || ""}`}>
      <span className={`${textSize} ${textClass}`}>{label}</span>
      <div className={`flex ${circleSize} items-center justify-center rounded-full border ${borderClass}`}>
        <Icon name="arrowRight" size={20} />
      </div>
    </div>
  );
}
