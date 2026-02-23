"use client";

import { Textarea } from "@/design-system/components";

interface CommentSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function CommentSection({ value, onChange }: CommentSectionProps) {
  return (
    <section className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6">
      <h3 className="text-[18px] md:text-[20px] font-medium mb-4 md:mb-6">
        Комментарий к заказу
      </h3>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Напишите пожелания к заказу, доставке или подготовке"
        maxLength={500}
        showCharCount
        fullWidth
      />

      <p className="text-[12px] text-[var(--color-dark)] mt-2">
        Менеджер позвонит вам для уточнения деталей
      </p>
    </section>
  );
}
