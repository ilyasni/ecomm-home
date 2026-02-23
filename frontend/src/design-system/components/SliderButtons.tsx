"use client";

import { Icon } from "@/design-system/icons";
import { IconButton } from "./IconButton";

type SliderButtonsProps = {
  size?: 24 | 40;
  className?: string;
  prevClassName?: string;
  nextClassName?: string;
};

export function SliderButtons({
  size = 40,
  className,
  prevClassName,
  nextClassName,
}: SliderButtonsProps) {
  const iconSize = size === 40 ? 20 : 16;

  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      <IconButton
        size={size}
        tone="muted"
        className={prevClassName}
        aria-label="Предыдущий"
      >
        <Icon name="arrowRight" size={iconSize} className="rotate-180" />
      </IconButton>
      <IconButton
        size={size}
        tone="accent"
        className={nextClassName}
        aria-label="Следующий"
      >
        <Icon name="arrowRight" size={iconSize} />
      </IconButton>
    </div>
  );
}
