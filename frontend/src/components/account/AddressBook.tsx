"use client";

import { useState } from "react";
import { Input, Button } from "@/design-system";
import { addresses } from "@/data/account";

export function AddressBook() {
  const [addressList, setAddressList] = useState(addresses);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-[var(--color-black)]">
        Адресная книга
      </h2>

      {addressList.map((address) => (
        <div
          key={address.id}
          className="rounded-[5px] border border-[var(--color-gray-light)] p-6"
        >
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[var(--color-dark-gray)]">
              {address.label}
            </span>
            <div className="flex items-center gap-2 text-sm text-[var(--color-brand)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0"
              >
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
              <div className="flex flex-col gap-3 max-w-[637px]">
                <Input
                  defaultValue={address.street}
                  fullWidth
                  placeholder="Улица, дом, квартира"
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => setEditingId(null)}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setEditingId(null)}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-w-[637px]">
                <Input
                  value={address.street}
                  readOnly
                  fullWidth
                />
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

      <Button
        variant="secondary"
        className="self-start"
        onClick={() => {
          const newAddr = {
            id: `addr-${Date.now()}`,
            label: "Адрес доставки",
            region: "Московская область",
            city: "г. Москва",
            street: "",
            isPrimary: false,
          };
          setAddressList((prev) => [...prev, newAddr]);
          setEditingId(newAddr.id);
        }}
      >
        Добавить дополнительный адрес
      </Button>
    </div>
  );
}
