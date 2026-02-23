"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { Icon } from "@/design-system/icons";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      isLoading = false,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // Base classes
    const baseClasses =
      "flex items-center justify-center rounded-[5px] font-normal text-base leading-[1.3] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    // Size classes
    const sizeClasses = {
      small: "px-6 py-3",
      medium: "px-8 py-3 h-[45px]",
      large: "px-8 py-4",
    };

    // Variant classes
    const variantClasses = {
      primary: isDisabled
        ? "border border-[var(--color-gray)] text-[var(--color-gray)] bg-transparent cursor-not-allowed"
        : "bg-[var(--color-button)] text-[var(--color-light)] hover:bg-[var(--color-gold)] hover:text-[var(--color-button)]",
      secondary: isDisabled
        ? "border border-[var(--color-gray)] text-[var(--color-gray)] bg-transparent cursor-not-allowed"
        : "border border-[var(--color-button)] text-[var(--color-button)] bg-transparent hover:bg-[var(--color-button)] hover:text-[var(--color-light)]",
      tertiary: isDisabled
        ? "border border-[var(--color-gray)] text-[var(--color-gray)] bg-transparent cursor-not-allowed"
        : "bg-[var(--color-gold)] text-[var(--color-button)] hover:bg-[var(--color-button)] hover:text-[var(--color-light)]",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Icon name="loading" size={24} className="animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
