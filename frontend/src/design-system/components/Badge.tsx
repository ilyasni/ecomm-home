"use client";

type BadgeProps = {
  label: string;
  tone?: "exclusive" | "new" | "sale";
  size?: "desktop" | "mobile";
  className?: string;
};

export function Badge({
  label,
  tone = "exclusive",
  size = "desktop",
  className,
}: BadgeProps) {
  const baseClass =
    tone === "sale"
      ? "bg-[var(--color-brand)] text-[var(--color-light)]"
      : "bg-[var(--color-gold)] text-[var(--color-light)]";
  const sizeClass = size === "desktop" ? "text-sm px-2 py-1" : "text-xs px-2 py-0.5";

  return (
    <span className={`${baseClass} ${sizeClass} ${className || ""}`}>
      {label}
    </span>
  );
}
