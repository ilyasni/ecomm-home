"use client";

import { Radio } from "@/design-system/components";
import { paymentMethods, type PaymentMethodType } from "@/data/account";

interface PaymentSectionProps {
  selected: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

export function PaymentSection({ selected, onChange }: PaymentSectionProps) {
  return (
    <section className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6">
      <h3 className="text-[18px] md:text-[20px] font-medium mb-4 md:mb-6">
        Способ оплаты
      </h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-start gap-3">
            <Radio
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={(val) => onChange(val as PaymentMethodType)}
              label={method.label}
            />
            {method.description && selected === method.id && (
              <span className="text-[13px] text-[var(--color-dark)] mt-0.5 hidden md:inline">
                {method.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
