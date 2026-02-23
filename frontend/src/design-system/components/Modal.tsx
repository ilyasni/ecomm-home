"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { Icon } from "@/design-system/icons";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** Боковая панель справа (для промо-попапа) */
  variant?: "center" | "right";
}

export function Modal({
  open,
  onClose,
  children,
  className = "",
  variant = "center",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  const isRight = variant === "right";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex ${
        isRight ? "justify-end" : "items-center justify-center"
      } bg-black/40`}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative bg-[var(--background)] overflow-y-auto ${
          isRight
            ? "h-full w-full max-w-[492px] p-8 desktop:p-12"
            : "m-4 w-full max-w-[474px] rounded-[5px] p-6 desktop:p-10 max-h-[90vh]"
        } ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex items-center justify-center"
          aria-label="Закрыть"
        >
          <Icon name="close" size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
