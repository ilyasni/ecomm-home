"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLink, Button, Input, Checkbox } from "@/design-system/components";
import { Icon } from "@/design-system/icons";

type BoutiqueProps = {
  title?: string;
  photos?: string[];
  videoUrl?: string | null;
};

const defaultPhotos = ["/assets/figma/placeholder.svg", "/assets/figma/placeholder.svg"];

export function Boutique({
  title = "Посетите бутик\nVITA BRAVA HOME",
  photos = defaultPhotos,
  videoUrl,
}: BoutiqueProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !privacyChecked) {
      toast.error("Заполните имя, телефон и подтвердите согласие на обработку данных");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, variant: "consultation" }),
      });
      if (!res.ok) throw new Error("Server error");
      toast.success("Заявка принята! Мы свяжемся с вами для записи на консультацию.");
      setName("");
      setPhone("");
      setPrivacyChecked(false);
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="desktop:px-0 desktop:py-0 mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <div className="desktop:flex-row desktop:items-center desktop:gap-[48px] desktop:h-[591px] flex flex-col gap-8 md:gap-10">
        <div className="desktop:w-[700px] desktop:shrink-0 desktop:h-[591px] flex gap-2 md:h-[343px]">
          {photos.slice(0, 2).map((photo, idx) => (
            <div
              key={idx}
              className="desktop:h-[591px] desktop:w-[346px] relative h-[289px] w-1/2 md:h-[400px]"
            >
              <Image
                src={photo}
                alt={`Бутик VITA BRAVA HOME ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-[var(--overlay-dark-medium)]" />
              {idx === 1 && (videoUrl || !videoUrl) && (
                <div className="absolute top-1/2 left-1/2 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
                  <Icon name="play" size={20} className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="desktop:w-[620px] flex flex-col">
          <div className="desktop:text-center flex flex-col gap-6 text-center">
            <h2 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium whitespace-pre-line">
              {title}
            </h2>
            <div className="flex justify-center">
              <ArrowLink label="Как нас найти" tone="dark" />
            </div>
          </div>
          <div className="desktop:text-center mt-12 flex flex-col gap-8 text-center">
            <div className="flex flex-col gap-4">
              <h3 className="desktop:text-[24px] text-xl leading-[1.1] font-medium">
                Записаться на консультацию
              </h3>
              <p className="desktop:text-base text-sm leading-[1.3] text-[var(--color-dark)]">
                Оцените качество наших тканей в фирменном магазине в Москве
              </p>
            </div>
            <form onSubmit={handleSubmit} className="desktop:w-[478px] mx-auto flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Имя"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="Телефон"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                />
              </div>
              <Checkbox
                label="Я ознакомлен с политикой конфиденциальности"
                checked={privacyChecked}
                onChange={setPrivacyChecked}
                className="text-sm text-[var(--color-dark)]"
              />
              <Button variant="primary" type="submit" fullWidth isLoading={isSubmitting}>
                Оставить заявку
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
