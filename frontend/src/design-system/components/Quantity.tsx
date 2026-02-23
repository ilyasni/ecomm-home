"use client";

import React, { useState } from "react";
import { Icon } from "@/design-system/icons";

export type QuantitySize = "small" | "medium" | "large";

export interface QuantityProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: QuantitySize;
  className?: string;
}

export function Quantity({
  value,
  onChange,
  min = 1,
  max,
  size = "medium",
  className = "",
}: QuantityProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (!max || value < max) {
      onChange(value + 1);
    }
  };

  const sizeClasses = {
    small: "h-[37px] px-3 py-1 gap-6",
    medium: "h-10 px-3 gap-8",
    large: "h-12 px-3 gap-8",
  };

  const textSizeClasses = {
    small: "text-base",
    medium: "text-lg",
    large: "text-2xl",
  };

  const buttonSizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-2xl",
  };

  return (
    <div
      className={`border border-[var(--color-gray-light)] rounded-[5px] flex items-center justify-center ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`flex items-center justify-center leading-[1.2] text-[var(--color-black)] disabled:text-[var(--color-gray)] disabled:cursor-not-allowed ${buttonSizeClasses[size]}`}
        aria-label="Уменьшить количество"
      >
        –
      </button>
      <span
        className={`font-normal leading-[1.5] text-[var(--color-black)] uppercase ${textSizeClasses[size]}`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={max !== undefined && value >= max}
        className={`flex items-center justify-center leading-[1.2] ${
          isHovering ? "text-[var(--color-gold)]" : "text-[var(--color-black)]"
        } disabled:text-[var(--color-gray)] disabled:cursor-not-allowed ${buttonSizeClasses[size]}`}
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  );
}
