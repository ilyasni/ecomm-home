"use client";

import { Radio, Input, Select } from "@/design-system/components";
import {
  deliveryMethods,
  deliveryCities,
  type DeliveryMethodType,
} from "@/data/account";

interface DeliverySectionProps {
  selectedMethod: DeliveryMethodType;
  city: string;
  address: string;
  boutiqueId: string;
  onMethodChange: (method: DeliveryMethodType) => void;
  onCityChange: (city: string) => void;
  onAddressChange: (address: string) => void;
  onBoutiqueSelect: () => void;
}

export function DeliverySection({
  selectedMethod,
  city,
  address,
  onMethodChange,
  onCityChange,
  onAddressChange,
  onBoutiqueSelect,
}: DeliverySectionProps) {
  const cityOptions = deliveryCities.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <section className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6">
      <h3 className="text-[18px] md:text-[20px] font-medium mb-4 md:mb-6">
        Способ получения
      </h3>

      <div className="space-y-3 mb-4">
        {deliveryMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between">
            <Radio
              name="delivery"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(val) => onMethodChange(val as DeliveryMethodType)}
              label={method.label}
            />
            <div className="text-right text-[13px] shrink-0 ml-4">
              <span className="font-medium">{method.price}</span>
              <span className="text-[var(--color-dark)] ml-2">{method.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedMethod === "pickup" ? (
        <button
          type="button"
          onClick={onBoutiqueSelect}
          className="w-full text-left border border-[var(--color-gray-light)] rounded-[5px] p-3 text-[14px] hover:bg-[var(--color-beige)] transition-colors"
        >
          <span className="text-[var(--color-dark)]">Выберите бутик для самовывоза</span>
        </button>
      ) : (
        <div className="space-y-3">
          <Select
            label="Город"
            options={cityOptions}
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Выберите город"
            fullWidth
          />
          <Input
            label="Адрес доставки"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Улица, дом, квартира"
            fullWidth
          />
        </div>
      )}
    </section>
  );
}
