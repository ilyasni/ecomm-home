"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Icon } from "@/design-system/icons";
import { Input, Textarea, Button } from "@/design-system/components";
import { PhoneInput } from "@/design-system/components/PhoneInput";

type OrderFormPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  variant?: "order" | "consultation";
};

export function OrderFormPanel({ isOpen, onClose, variant = "order" }: OrderFormPanelProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !privacyChecked) {
      toast.error("Заполните обязательные поля и подтвердите согласие на обработку данных");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, comment, variant }),
      });
      if (!res.ok) throw new Error("Server error");
      toast.success(
        variant === "order"
          ? "Заявка на заказ принята! Мы свяжемся с вами в ближайшее время."
          : "Заявка на консультацию принята! Мы свяжемся с вами в ближайшее время."
      );
      setName("");
      setPhone("");
      setEmail("");
      setComment("");
      setPrivacyChecked(false);
      onClose();
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isOrder = variant === "order";
  const title = isOrder ? "Сделать заказ" : "Заявка на онлайн консультацию";
  const buttonLabel = isOrder ? "Сделать заказ" : "Отправить заявку";

  return (
    <div className="fixed inset-0 z-[100] flex" onClick={onClose}>
      <div className="flex-1 bg-black/25 max-md:hidden" />

      <div
        className="relative flex w-full flex-col bg-[var(--background)] md:w-[720px] md:shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-end px-4 pt-6 md:px-[49px] md:pt-8">
          <button
            type="button"
            onClick={onClose}
            className="transition-opacity hover:opacity-70"
            aria-label="Закрыть"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6 md:px-[49px] md:pb-8">
          <h2 className="text-[20px] leading-[1.1] font-medium md:text-[24px]">{title}</h2>

          <div className="flex flex-col gap-2 md:gap-3">
            <Input
              placeholder="Ваше имя*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <PhoneInput
              placeholder="999 999 99 99"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />

            {isOrder && (
              <Input
                placeholder="Ваш email*"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            )}

            <Textarea
              placeholder="Комментарий к заказу"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={160}
              showCharCount
              fullWidth
              rows={5}
            />
          </div>

          <div className="flex flex-col gap-6">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-[18px] w-[18px] shrink-0 appearance-none rounded-[2px] border border-[var(--color-gray)] checked:border-[var(--color-brand)] checked:bg-[var(--color-brand)]"
                checked={privacyChecked}
                onChange={(e) => setPrivacyChecked(e.target.checked)}
              />
              <span className="text-[14px] leading-[1.3] text-[var(--color-black)]">
                Я ознакомлен с{" "}
                <Link href="/info/privacy" className="underline">
                  Политикой конфиденциальности
                </Link>{" "}
                и согласен на{" "}
                <Link href="/info/consent" className="underline">
                  обработку моих персональных данных
                </Link>
              </span>
            </label>

            <Button variant="primary" fullWidth onClick={handleSubmit} isLoading={isSubmitting}>
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
