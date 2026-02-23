"use client";

type SliderDotsProps = {
  variant?: "desktop" | "desktopDark" | "mobileLight" | "mobileDark";
  className?: string;
  count?: number;
  activeIndex?: number;
};

export function SliderDots({
  variant = "desktop",
  className,
  count = 5,
  activeIndex = 0,
}: SliderDotsProps) {
  const activeColor =
    variant === "desktop" || variant === "mobileLight"
      ? "bg-[var(--color-light)]"
      : "bg-[var(--color-foreground)]";
  const inactiveColor =
    variant === "desktop" || variant === "mobileLight"
      ? "bg-[var(--color-selection)]"
      : "bg-[var(--color-gray-light)]";
  const heightClass = variant.startsWith("desktop") ? "h-[3px]" : "h-[2px]";

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {Array.from({ length: count }).map((_, index) => (
        <span
          className={`w-6 ${heightClass} ${
            index === activeIndex ? activeColor : inactiveColor
          }`}
          key={index}
        />
      ))}
    </div>
  );
}
