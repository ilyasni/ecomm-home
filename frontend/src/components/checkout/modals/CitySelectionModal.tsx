"use client";

import { useState } from "react";
import { Modal, SearchInput } from "@/design-system/components";
import { deliveryCities } from "@/data/account";

interface CitySelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (cityId: string) => void;
}

export function CitySelectionModal({
  open,
  onClose,
  onSelect,
}: CitySelectionModalProps) {
  const [search, setSearch] = useState("");

  const filtered = deliveryCities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, city) => {
    const letter = city.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(city);
    return acc;
  }, {});

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 md:p-8 max-w-[736px] mx-auto">
        <h2 className="text-[18px] md:text-[22px] font-medium mb-4">
          Выберите город
        </h2>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Название города"
          fullWidth
          className="mb-4"
        />

        <div className="max-h-[400px] overflow-y-auto">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b, "ru"))
            .map(([letter, cities]) => (
              <div key={letter} className="mb-3">
                <p className="text-[13px] text-[var(--color-dark)] font-medium mb-1">
                  {letter}
                </p>
                {cities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => onSelect(city.id)}
                    className="w-full text-left py-2 text-[14px] hover:text-[var(--color-gold)] transition-colors"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            ))}

          {filtered.length === 0 && (
            <p className="text-[14px] text-[var(--color-dark)] text-center py-8">
              Город не найден
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
