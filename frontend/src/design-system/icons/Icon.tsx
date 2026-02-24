"use client";

import type { SyntheticEvent } from "react";
import { iconMap, type IconName, type IconVariant } from "./icon-map";

type IconProps = {
  name: IconName;
  size?: number;
  alt?: string;
  variant?: IconVariant;
  height?: number;
  className?: string;
};

export function Icon({
  name,
  size = 24,
  alt = "",
  variant = "default",
  height,
  className,
}: IconProps) {
  const iconData = iconMap[name];

  if (!iconData) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  const primarySource = iconData[variant] ?? iconData.default;
  const fallbackSource = iconData.default;
  if (!primarySource) {
    return null;
  }

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const alreadyTriedFallback = img.dataset.fallbackApplied === "true";
    if (!alreadyTriedFallback && fallbackSource && img.getAttribute("src") !== fallbackSource) {
      img.dataset.fallbackApplied = "true";
      img.src = fallbackSource;
      return;
    }
    img.style.display = "none";
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={`${name}-${variant}`}
      src={primarySource}
      alt={alt || name}
      width={size}
      height={height ?? size}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}
