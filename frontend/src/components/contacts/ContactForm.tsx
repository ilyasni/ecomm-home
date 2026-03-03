"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input, PhoneInput, Textarea, Checkbox, Button } from "@/design-system/components";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !privacyChecked) {
      toast.error("Заполните имя и подтвердите согласие на обработку данных");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      if (!res.ok) throw new Error("Server error");
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      setName("");
      setPhone("");
      setMessage("");
      setPrivacyChecked(false);
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="desktop:p-10 rounded-[5px] border border-[var(--color-gray-light)] p-6 md:p-8">
      <div className="desktop:flex-row desktop:gap-16 flex flex-col">
        <div className="desktop:w-[340px] shrink-0">
          <h3 className="desktop:text-xl text-lg leading-[1.1] font-medium">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="mt-4 text-sm leading-[1.5] text-[var(--color-dark)]">
            Заполните форму для обратной связи и мы вам перезвоним!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="desktop:mt-0 mt-6 flex flex-1 flex-col gap-4">
          <Input
            placeholder="Имя*"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Textarea
            placeholder="Ваше обращение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={160}
          />
          <Checkbox
            label="Я соглашаюсь на обработку персональных данных в соответствии с политикой конфиденциальности"
            checked={privacyChecked}
            onChange={setPrivacyChecked}
          />
          <Button variant="primary" type="submit" fullWidth isLoading={isSubmitting}>
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
}
