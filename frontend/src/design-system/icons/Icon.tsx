"use client";

import { useState, useEffect, useRef } from "react";
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

  // Determine the source path - paths should start with / (relative to public folder)
  const primarySource = iconData[variant] ?? iconData.default;
  const fallbackSource = iconData.default;

  const [imgSrc, setImgSrc] = useState<string>(primarySource);
  const [hasError, setHasError] = useState(false);
  const hasTriedFallback = useRef(false);

  // Reset when name or variant changes
  useEffect(() => {
    setImgSrc(primarySource);
    setHasError(false);
    hasTriedFallback.current = false;
  }, [name, variant, primarySource]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Prevent infinite loop - only try fallback once
    if (hasTriedFallback.current) {
      setHasError(true);
      return;
    }

    // If we haven't tried fallback yet and current source is not the fallback
    if (fallbackSource && imgSrc !== fallbackSource && imgSrc === primarySource) {
      // Try fallback if primary source failed
      hasTriedFallback.current = true;
      setImgSrc(fallbackSource);
    } else {
      // Already on fallback or no fallback available
      hasTriedFallback.current = true;
      setHasError(true);
    }
  };

  if (!imgSrc) {
    return null;
  }

  // If both sources failed, return null or a placeholder
  if (hasError && hasTriedFallback.current) {
    return null;
  }

  return (
    <img
      key={`${name}-${variant}-${imgSrc}`}
      src={imgSrc}
      alt={alt || name}
      width={size}
      height={height ?? size}
      className={className}
      loading="lazy"
      onError={handleError}
      onLoad={() => setHasError(false)}
    />
  );
}
