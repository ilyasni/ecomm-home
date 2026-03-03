"use client";

import { useEffect, useState } from "react";
import { Radio, Input, Select } from "@/design-system/components";
import { deliveryMethods, deliveryCities, type DeliveryMethodType } from "@/data/account";

interface CdekPriceResult {
  price: number;
  periodMin: number;
  periodMax: number;
}

interface DeliverySectionProps {
  selectedMethod: DeliveryMethodType;
  city: string;
  address: string;
  boutiqueId: string;
  onMethodChange: (method: DeliveryMethodType) => void;
  onCityChange: (city: string) => void;
  onAddressChange: (address: string) => void;
  onBoutiqueSelect: () => void;
  onCdekPriceUpdate?: (price: number) => void;
}

export function DeliverySection({
  selectedMethod,
  city,
  address,
  onMethodChange,
  onCityChange,
  onAddressChange,
  onBoutiqueSelect,
  onCdekPriceUpdate,
}: DeliverySectionProps) {
  const [cdekData, setCdekData] = useState<CdekPriceResult | null>(null);
  const [cdekLoading, setCdekLoading] = useState(false);

  // Запрашивать цену СДЭК при выборе cdek или смене города
  useEffect(() => {
    if (selectedMethod !== "cdek") return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCdekLoading(true);

    fetch("/api/delivery/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toCity: city }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CdekPriceResult | null) => {
        if (cancelled || !data) return;
        setCdekData(data);
        onCdekPriceUpdate?.(data.price);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCdekLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedMethod, city, onCdekPriceUpdate]);

  const cityOptions = deliveryCities.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  function getMethodPrice(method: (typeof deliveryMethods)[number]): string {
    if (method.id !== "cdek") return method.price;
    if (cdekLoading) return "Рассчитывается...";
    if (cdekData) return `${cdekData.price} ₽`;
    return method.price;
  }

  function getMethodDuration(method: (typeof deliveryMethods)[number]): string {
    if (method.id !== "cdek") return method.duration;
    if (cdekData) return `${cdekData.periodMin}–${cdekData.periodMax} дн.`;
    return method.duration;
  }

  return (
    <section className="rounded-[5px] border border-[var(--color-gray-light)] p-4 md:p-6">
      <h3 className="mb-4 text-[18px] font-medium md:mb-6 md:text-[20px]">Способ получения</h3>

      <div className="mb-4 space-y-3">
        {deliveryMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between">
            <Radio
              name="delivery"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(val) => onMethodChange(val as DeliveryMethodType)}
              label={method.label}
            />
            <div className="ml-4 shrink-0 text-right text-[13px]">
              <span className="font-medium">{getMethodPrice(method)}</span>
              {!cdekLoading && (
                <span className="ml-2 text-[var(--color-dark)]">{getMethodDuration(method)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMethod === "pickup" ? (
        <button
          type="button"
          onClick={onBoutiqueSelect}
          className="w-full rounded-[5px] border border-[var(--color-gray-light)] p-3 text-left text-[14px] transition-colors hover:bg-[var(--color-beige)]"
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
          {selectedMethod !== "cdek" && (
            <Input
              label="Адрес доставки"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Улица, дом, квартира"
              fullWidth
            />
          )}
          {selectedMethod === "cdek" && (
            <Input
              label="Адрес пункта выдачи СДЭК"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Адрес пункта СДЭК или оставьте пустым"
              fullWidth
            />
          )}
        </div>
      )}
    </section>
  );
}
