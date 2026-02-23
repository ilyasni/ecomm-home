"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

export type InputState = "default" | "fill" | "typing" | "error" | "disabled";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: InputState;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      state = "default",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const isError = state === "error";
    const isDisabled = state === "disabled" || disabled;
    const isFilled = state === "fill" || (props.value && props.value.toString().length > 0);

    const baseClasses = "border rounded-[5px] px-3 py-3 text-base leading-[1.3] transition-colors";
    const stateClasses = isError
      ? "border-[var(--color-error)]"
      : isFilled && !isDisabled
        ? "border-[var(--color-brown)]"
        : "border-[var(--color-gray-light)]";
    const textClasses = isDisabled
      ? "text-[var(--color-gray)] bg-transparent"
      : isFilled
        ? "text-[var(--color-dark-gray)]"
        : "text-[var(--color-gray)]";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="text-base leading-[1.3] text-[var(--color-black)]">{label}</label>
        )}
        <input
          ref={ref}
          disabled={isDisabled}
          className={`${baseClasses} ${stateClasses} ${textClasses} ${widthClasses} ${className}`}
          placeholder={props.placeholder || "Введите текст"}
          {...props}
        />
        {(errorText || helperText) && (
          <div className="text-xs leading-[1.1] text-[var(--color-gray)]">
            {isError && errorText ? (
              <span className="text-[var(--color-error)]">{errorText}</span>
            ) : (
              helperText
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
