"use client";

import { useState } from "react";
import { Input } from "@/design-system/components";
import { Icon } from "@/design-system/icons";

interface ReferralSectionProps {
  promoCode: string;
  bonusesToSpend: number;
  availableBonuses: number;
  onPromoChange: (code: string) => void;
  onPromoApply: () => void;
  onBonusesChange: (amount: number) => void;
  promoStatus?: "idle" | "loading" | "success" | "error";
  promoMessage?: string;
}

export function ReferralSection({
  promoCode,
  bonusesToSpend,
  availableBonuses,
  onPromoChange,
  onPromoApply,
  onBonusesChange,
  promoStatus = "idle",
  promoMessage,
}: ReferralSectionProps) {
  const [showBonusInput, setShowBonusInput] = useState(bonusesToSpend > 0);

  return (
    <section className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6">
      <h3 className="text-[18px] md:text-[20px] font-medium mb-4 md:mb-6">
        Промокод и бонусы
      </h3>

      <div className="space-y-4">
        {/* Промокод */}
        <div>
          <p className="text-[14px] font-medium mb-2">Промокод</p>
          <div className="relative">
            <Input
              value={promoCode}
              onChange={(e) => onPromoChange(e.target.value)}
              placeholder="Введите промокод"
              fullWidth
              state={promoStatus === "error" ? "error" : "default"}
              errorText={promoStatus === "error" ? promoMessage : undefined}
            />
            <button
              type="button"
              onClick={onPromoApply}
              disabled={promoStatus === "loading" || !promoCode}
              className="absolute right-3 top-[13px] text-[var(--color-dark)] hover:text-[var(--color-black)] disabled:opacity-40"
              aria-label="Применить промокод"
            >
              {promoStatus === "loading" ? (
                <Icon name="loading" size={16} />
              ) : (
                <Icon name="arrowRight" size={16} />
              )}
            </button>
          </div>
          {promoStatus === "success" && promoMessage && (
            <p className="text-[12px] text-[var(--color-gold)] mt-1 flex items-center gap-1">
              <Icon name="checkCircle" size={14} />
              {promoMessage}
            </p>
          )}
        </div>

        {/* Бонусы */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[14px] font-medium">Списать бонусы</p>
            <button
              type="button"
              onClick={() => setShowBonusInput(!showBonusInput)}
              className="text-[13px] text-[var(--color-dark)] underline"
            >
              {showBonusInput ? "Скрыть" : "Показать"}
            </button>
          </div>

          {showBonusInput && (
            <>
              <div className="relative">
                <Input
                  value={bonusesToSpend.toString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onBonusesChange(Math.min(val, availableBonuses));
                  }}
                  type="number"
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => onBonusesChange(availableBonuses)}
                  className="absolute right-3 top-[13px] text-[var(--color-dark)] hover:text-[var(--color-black)]"
                  aria-label="Списать все"
                >
                  <Icon name="arrowRight" size={16} />
                </button>
              </div>
              <p className="text-[12px] text-[var(--color-dark)] mt-1">
                Доступно <strong>{availableBonuses}</strong> бонусов &nbsp; 1 бонус = 1 ₽
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
