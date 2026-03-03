"use client";

import { useState, useEffect } from "react";
import { Input, Button } from "@/design-system";
import type { MedusaAddress } from "@/types/medusa";

type LocalAddress = {
  id: string;
  label: string;
  region: string;
  city: string;
  street: string;
  isPrimary: boolean;
};

function toLocal(a: MedusaAddress): LocalAddress {
  return {
    id: a.id,
    label: a.is_default_shipping ? "Основной адрес" : "Адрес доставки",
    region: a.province ?? "Россия",
    city: a.city ?? "",
    street: a.address_1 ?? "",
    isPrimary: a.is_default_shipping,
  };
}

export function AddressBook() {
  const [addressList, setAddressList] = useState<LocalAddress[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/account/addresses")
      .then((res) => res.json())
      .then((data: { addresses?: MedusaAddress[] }) => {
        setAddressList((data.addresses ?? []).map(toLocal));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddNew = async () => {
    if (!newStreet.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_1: newStreet,
          city: newCity.trim() || "Москва",
          country_code: "ru",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { address?: MedusaAddress };
        if (data.address) setAddressList((prev) => [...prev, toLocal(data.address!)]);
        setShowNewForm(false);
        setNewStreet("");
        setNewCity("");
      }
    } catch {
      // silent
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-medium text-[var(--color-black)]">Адресная книга</h2>
        <p className="text-sm text-[var(--color-gray)]">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-[var(--color-black)]">Адресная книга</h2>

      {addressList.map((address) => (
        <div key={address.id} className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[var(--color-dark-gray)]">{address.label}</span>
            <div className="flex items-center gap-2 text-sm text-[var(--color-brand)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              <span>
                {address.region} {address.city}
              </span>
            </div>

            {editingId === address.id ? (
              <div className="flex max-w-[637px] flex-col gap-3">
                <Input defaultValue={address.street} fullWidth placeholder="Улица, дом, квартира" />
                <div className="flex gap-2">
                  <Button variant="primary" size="small" onClick={() => setEditingId(null)}>
                    Сохранить
                  </Button>
                  <Button variant="secondary" size="small" onClick={() => setEditingId(null)}>
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex max-w-[637px] flex-col gap-2">
                <Input value={address.street} readOnly fullWidth />
                <button
                  type="button"
                  onClick={() => setEditingId(address.id)}
                  className="self-start text-sm text-[var(--color-brand)] underline hover:no-underline"
                >
                  Изменить
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {showNewForm ? (
        <div className="flex max-w-[637px] flex-col gap-3 rounded-[5px] border border-[var(--color-gray-light)] p-6">
          <Input
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
            fullWidth
            placeholder="Улица, дом, квартира"
          />
          <Input
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            fullWidth
            placeholder="Город (по умолчанию — Москва)"
          />
          <div className="flex gap-2">
            <Button variant="primary" size="small" onClick={handleAddNew} isLoading={isSaving}>
              Сохранить
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setShowNewForm(false);
                setNewStreet("");
                setNewCity("");
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" className="self-start" onClick={() => setShowNewForm(true)}>
          Добавить дополнительный адрес
        </Button>
      )}
    </div>
  );
}
